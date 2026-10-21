// src/prompts.ts
import * as p from '@clack/prompts'
import pc from 'picocolors'
import type {
  UserPreferences,
  ConflictInfo,
  LocalProvider,
  LocalProviderModel,
} from '../../../src/types/index.js'
import {
  confirmLaunchMessage,
  fmtModel,
  modelSelectOption,
  navOption,
  printEnvConflictPanel,
  providerSelectOption,
  gateIntro,
  gateOutro,
  formatModelLabel,
} from './ui.js'
import { scoreModelSearch } from './model-search.js'
import { classifyFreeStatus, isFreeStatus } from './free-models.js'
import { MAX_MODEL_CATALOG } from '../../../src/config/constants.js'

const BROWSE_ALL = '__browse_all__'
const MAX_RECENT = 3
/** Providers with more models than this offer search or paginated browse. */
export const MODEL_SEARCH_THRESHOLD = 25
/** Models shown per page when browsing large catalogs. */
export const MODEL_PAGE_SIZE = 15

const PAGE_PREV = '__page_prev__'
const PAGE_NEXT = '__page_next__'
const SWITCH_SEARCH = '__switch_search__'
const SWITCH_BROWSE = '__switch_browse__'
const MODE_SEARCH = 'search'
const MODE_BROWSE = 'browse'

type ModelSearchable = { id: string; name: string; brand: string }
type ModelSelectOption = { value: string; label: string; hint: string }
type LargeCatalogMode = 'choose' | 'search' | 'browse'

function sortModelsByBrand<T extends ModelSearchable>(models: T[]): T[] {
  return [...models].sort((a, b) => {
    const brandCmp = a.brand.localeCompare(b.brand, undefined, { sensitivity: 'base' })
    if (brandCmp !== 0) return brandCmp
    const nameA = a.name || a.id
    const nameB = b.name || b.id
    return nameA.localeCompare(nameB, undefined, { sensitivity: 'base', numeric: true })
  })
}

export function filterModelsBySearch<T extends ModelSearchable>(models: T[], query: string): T[] {
  if (!query.trim()) return []
  return models
    .map((model, index) => ({
      model,
      index,
      score: scoreModelSearch(query, [
        { value: model.name, weight: 800 },
        { value: model.id, weight: 700 },
        { value: model.brand, weight: 350 },
      ]),
    }))
    .filter(result => result.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.index - b.index
    })
    .map(result => result.model)
}

/** Slice a model list for paginated browse UI. */
export function sliceModelPage<T>(
  items: T[],
  page: number,
  pageSize = MODEL_PAGE_SIZE
): { items: T[]; page: number; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const clampedPage = Math.min(Math.max(0, page), totalPages - 1)
  const start = clampedPage * pageSize
  return {
    items: items.slice(start, start + pageSize),
    page: clampedPage,
    totalPages,
  }
}

type PagedPickResult<T> = T | 'search' | 'browse' | 'menu'

function isSelectedModel<T extends { id: string }>(value: PagedPickResult<T>): value is T {
  return value !== 'search' && value !== 'browse' && value !== 'menu'
}

/** Paginated model picker — exported for global favorites search. */
export async function pickModelFromPagedList<T extends { id: string }>(
  list: T[],
  toOption: (m: T) => ModelSelectOption,
  messagePrefix: string,
  initialModelId?: string,
  links?: { search?: boolean; browse?: boolean; newSearch?: boolean }
): Promise<PagedPickResult<T>> {
  let page = 0

  if (initialModelId) {
    const idx = list.findIndex(m => m.id === initialModelId)
    if (idx >= 0) page = Math.floor(idx / MODEL_PAGE_SIZE)
  }

  while (true) {
    const { items: pageItems, page: currentPage, totalPages } = sliceModelPage(list, page)
    const options: ModelSelectOption[] = []

    if (currentPage > 0) {
      options.push(navOption(PAGE_PREV, '← Previous page', `Page ${currentPage} of ${totalPages}`))
    }

    options.push(...pageItems.map(toOption))

    if (currentPage < totalPages - 1) {
      options.push(navOption(PAGE_NEXT, 'Next page →', `Page ${currentPage + 2} of ${totalPages}`))
    }

    if (links?.search) {
      options.push(navOption(SWITCH_SEARCH, 'Search instead →', ''))
    }
    if (links?.browse) {
      options.push(navOption(SWITCH_BROWSE, 'Browse all instead →', ''))
    }
    if (links?.newSearch) {
      options.push(navOption(SWITCH_SEARCH, '← New search', ''))
    }

    const initialValue =
      (initialModelId && pageItems.some(m => m.id === initialModelId)
        ? initialModelId
        : pageItems[0]?.id) ?? options[0]?.value

    const picked = await p.select({
      message: `${messagePrefix} (page ${currentPage + 1} of ${totalPages})`,
      options,
      initialValue,
    })

    if (p.isCancel(picked)) return 'menu'

    const choice = String(picked)
    if (choice === PAGE_PREV) {
      page = currentPage - 1
      continue
    }
    if (choice === PAGE_NEXT) {
      page = currentPage + 1
      continue
    }
    if (choice === SWITCH_SEARCH) return 'search'
    if (choice === SWITCH_BROWSE) return 'browse'

    const selected = list.find(m => m.id === choice)
    if (selected) return selected
    continue
  }
}

async function selectLargeCatalog<T extends ModelSearchable & { id: string }>(
  models: T[],
  browseList: T[],
  toOption: (m: T) => ModelSelectOption,
  message: string,
  initialModelId?: string
): Promise<T | 'back' | null> {
  let mode: LargeCatalogMode = 'choose'

  while (true) {
    if (mode === 'choose') {
      const method = await p.select({
        message: `${message} (${models.length} available)`,
        options: [
          {
            value: MODE_SEARCH,
            label: pc.cyan('Search models'),
            hint: 'Filter by name, id, or brand',
          },
          {
            value: MODE_BROWSE,
            label: pc.cyan('Browse all models'),
            hint: `${MODEL_PAGE_SIZE} per page · ${Math.ceil(browseList.length / MODEL_PAGE_SIZE)} pages`,
          },
          navOption('__back__', '← Go back', 'Select a different provider'),
        ],
      })

      if (p.isCancel(method) || String(method) === '__back__') {
        return 'back'
      }

      mode = method === MODE_BROWSE ? 'browse' : 'search'
      continue
    }

    if (mode === 'browse') {
      const picked = await pickModelFromPagedList(browseList, toOption, message, initialModelId, {
        search: true,
      })

      if (picked === 'search') {
        mode = 'search'
        continue
      }
      if (picked === 'menu') {
        mode = 'choose'
        continue
      }
      if (isSelectedModel(picked)) return picked

      continue
    }

    const searchInput = await p.text({
      message: `Search models (${models.length} available):`,
      placeholder: 'e.g. claude, sonnet, llama',
    })

    if (p.isCancel(searchInput)) {
      mode = 'choose'
      continue
    }

    const matched = filterModelsBySearch(browseList, String(searchInput))
    if (matched.length === 0) {
      p.log.warn('No models match — try a different search')
      continue
    }

    const result = await pickModelFromPagedList(
      matched,
      toOption,
      matched.length === 1 ? 'Match found' : `Select model (${matched.length} matches)`,
      initialModelId,
      { browse: true, newSearch: true }
    )

    if (result === 'search') continue
    if (result === 'browse') {
      mode = 'browse'
      continue
    }
    if (result === 'menu') {
      mode = 'choose'
      continue
    }
    if (isSelectedModel(result)) return result
  }
}

async function selectModelWithSearch<T extends ModelSearchable & { id: string }>(
  models: T[],
  toOption: (m: T) => ModelSelectOption,
  message: string,
  initialModelId?: string,
  browseList?: T[]
): Promise<T | 'back' | null> {
  if (models.length === 0) return null

  const orderedBrowse = browseList ?? sortModelsByBrand(models)

  if (models.length <= MODEL_SEARCH_THRESHOLD) {
    const options = [...models.map(toOption), navOption('__back__', '← Go back', '')]
    const initialValue =
      initialModelId && options.some(o => o.value === initialModelId)
        ? initialModelId
        : options[0]?.value

    const picked = await p.select({
      message,
      options,
      initialValue,
    })

    if (p.isCancel(picked) || String(picked) === '__back__') {
      return 'back'
    }

    const selected = models.find(m => m.id === String(picked))
    if (!selected) return null
    return selected
  }

  return selectLargeCatalog(models, orderedBrowse, toOption, message, initialModelId)
}

function noteEnvConflicts(conflicts: ConflictInfo[]): void {
  printEnvConflictPanel(conflicts)
}

function modelToOption(model: LocalProviderModel, hint?: string) {
  return modelSelectOption(model, hint)
}

export async function browseAllModels(
  provider: LocalProvider,
  prefs: UserPreferences
): Promise<LocalProviderModel | 'back' | null> {
  return selectModelWithSearch(
    provider.models,
    m => modelToOption(m),
    'Which model?',
    prefs.lastModel
  )
}

export async function pickLocalModel(
  provider: LocalProvider,
  conflicts: ConflictInfo[],
  prefs: UserPreferences
): Promise<LocalProviderModel | 'back' | null> {
  // Show recently used models for this provider if we have any.
  const recentIds = (prefs.recentModelsByProvider?.[provider.id] ?? []).slice(0, MAX_RECENT)
  const recentModels = recentIds
    .map(id => provider.models.find(m => m.id === id))
    .filter((m): m is LocalProviderModel => m !== undefined)

  let selectedModel: LocalProviderModel | null = null

  while (true) {
    if (recentModels.length > 0) {
      const options = [
        ...recentModels.map(m => modelToOption(m, 'recent')),
        navOption(BROWSE_ALL, 'Browse all models →', `${provider.models.length} available`),
        navOption('__back__', '← Go back', 'Select a different provider'),
      ]

      const picked = await p.select({
        message: 'Which model?',
        options,
        initialValue: recentModels[0].id,
      })

      if (p.isCancel(picked) || String(picked) === '__back__') {
        return 'back'
      }

      if (String(picked) === BROWSE_ALL) {
        const browsed = await browseAllModels(provider, prefs)
        if (browsed === 'back') {
          continue
        }
        if (!browsed) return null
        selectedModel = browsed
        break
      } else {
        selectedModel = recentModels.find(m => m.id === String(picked))!
        break
      }
    } else {
      const browsed = await browseAllModels(provider, prefs)
      if (browsed === 'back') {
        return 'back'
      }
      if (!browsed) return null
      selectedModel = browsed
      break
    }
  }

  noteEnvConflicts(conflicts)

  const modelLabel = formatModelLabel(selectedModel)
  const confirmed = await p.confirm({
    message: confirmLaunchMessage('Claude Code', modelLabel, selectedModel.id, provider.name),
    initialValue: true,
  })

  if (p.isCancel(confirmed) || !confirmed) {
    p.cancel('Cancelled.')
    return null
  }

  gateOutro('Launching', fmtModel(modelLabel, selectedModel.id))
  return selectedModel
}

// ── Custom multi-model picker ─────────────────────────────────────
// Lets the user hand-pick which of a provider's models land in the app's
// /model switcher, with a Free / Paid / All price filter plus text search.

export type PriceFilter = 'all' | 'free' | 'paid'

export interface CustomPickerFilter {
  priceFilter: PriceFilter
  query: string
}

type PriceBucket = 'free' | 'paid' | 'unknown'

const FILTER_ALL = '__filter_all__'
const FILTER_FREE = '__filter_free__'
const FILTER_PAID = '__filter_paid__'
const PICKER_SEARCH = '__picker_search__'
const PICKER_SELECT = '__picker_select__'
const PICKER_BACK = '__back__'
const PICKER_NEXT = '__picker_next__'
const PICKER_PREV = '__picker_prev__'
const PICKER_DONE = '__picker_done__'
const PICKER_CHANGE_FILTER = '__picker_change_filter__'

function priceBucketForPicker(model: LocalProviderModel, providerId: string): PriceBucket {
  if (model.isFree || isFreeStatus(model.freeStatus)) return 'free'
  const status = classifyFreeStatus({
    model: { cost: model.cost, isFree: model.isFree, freeStatus: model.freeStatus },
    providerId,
  })
  if (isFreeStatus(status)) return 'free'
  if (status === 'paid') return 'paid'
  return 'unknown'
}

/** Price + text filter for the custom model picker — pure, unit-testable. */
export function filterProviderModelsForPicker(
  models: LocalProviderModel[],
  providerId: string,
  filter: CustomPickerFilter
): LocalProviderModel[] {
  const byPrice =
    filter.priceFilter === 'all'
      ? models
      : models.filter(m => priceBucketForPicker(m, providerId) === filter.priceFilter)
  if (!filter.query.trim()) return byPrice
  return filterModelsBySearch(byPrice, filter.query)
}

function countPickerBuckets(
  models: LocalProviderModel[],
  providerId: string
): Record<PriceBucket | 'all', number> {
  const counts: Record<PriceBucket | 'all', number> = {
    all: models.length,
    free: 0,
    paid: 0,
    unknown: 0,
  }
  for (const m of models) counts[priceBucketForPicker(m, providerId)] += 1
  return counts
}

/** Paged multiselect accumulator — picks persist across pages. Mutates `selected`. */
async function runCustomMultiselect(
  visible: LocalProviderModel[],
  selected: Set<string>
): Promise<'accept' | 'filter' | 'back' | 'cancel'> {
  let page = 0
  while (true) {
    const { items, page: currentPage, totalPages } = sliceModelPage(visible, page)
    const picked = await p.multiselect<string>({
      message: `Select models (page ${currentPage + 1} of ${totalPages} · ${selected.size} chosen — Space to toggle, Enter to continue)`,
      options: items.map(m => modelToOption(m)),
      initialValues: items.filter(m => selected.has(m.id)).map(m => m.id),
      required: false,
    })
    // Esc returns to the filter menu, keeping any picks so far.
    if (p.isCancel(picked)) return 'filter'

    for (const m of items) selected.delete(m.id)
    for (const id of picked) selected.add(id)
    if (selected.size > MAX_MODEL_CATALOG) {
      const trimmed = [...selected].slice(0, MAX_MODEL_CATALOG)
      selected.clear()
      for (const id of trimmed) selected.add(id)
      p.log.warn(
        `The /model switcher holds ${MAX_MODEL_CATALOG} models max — keeping the first ${MAX_MODEL_CATALOG}.`
      )
    }

    const nextOptions: Array<{ value: string; label: string; hint?: string }> = []
    if (currentPage < totalPages - 1) {
      nextOptions.push({
        value: PICKER_NEXT,
        label: pc.cyan('Next page →'),
        hint: `Page ${currentPage + 2} of ${totalPages}`,
      })
    }
    if (currentPage > 0) {
      nextOptions.push({
        value: PICKER_PREV,
        label: pc.cyan('← Previous page'),
        hint: `Page ${currentPage} of ${totalPages}`,
      })
    }
    nextOptions.push({
      value: PICKER_DONE,
      label: pc.green(`Done — continue with ${selected.size} selected`),
      hint: selected.size === 0 ? 'Pick at least one model first' : '',
    })
    nextOptions.push({
      value: PICKER_CHANGE_FILTER,
      label: pc.cyan('Change filter / search'),
      hint: '',
    })
    nextOptions.push(navOption(PICKER_BACK, '← Go back', 'Select a different provider'))

    const next: string | symbol = await p.select<string>({
      message: `${selected.size} model${selected.size === 1 ? '' : 's'} selected`,
      options: nextOptions,
    })
    if (p.isCancel(next)) return 'filter'
    if (next === PICKER_NEXT) {
      page = currentPage + 1
      continue
    }
    if (next === PICKER_PREV) {
      page = currentPage - 1
      continue
    }
    if (next === PICKER_CHANGE_FILTER) return 'filter'
    if (next === PICKER_BACK) return 'back'
    if (selected.size === 0) {
      p.log.warn('Select at least one model.')
      continue
    }
    return 'accept'
  }
}

/**
 * Multi-model picker for a single provider. Returns the chosen model ids in
 * pick order (`selectedIds[0]` boots), 'back' to reselect the provider, or
 * null on cancel.
 */
export async function pickCustomProviderModels(
  provider: LocalProvider,
  prefs: UserPreferences,
  opts?: { preselectedIds?: string[] }
): Promise<{ selectedIds: string[] } | 'back' | null> {
  if (provider.models.length === 0) return null

  const validIds = new Set(provider.models.map(m => m.id))
  const selected = new Set<string>()
  const seed =
    opts?.preselectedIds ??
    (prefs.lastModel && validIds.has(prefs.lastModel) ? [prefs.lastModel] : [])
  for (const id of seed) {
    if (validIds.has(id)) selected.add(id)
  }

  let priceFilter: PriceFilter = 'all'
  let query = ''

  while (true) {
    const buckets = countPickerBuckets(provider.models, provider.id)
    const visible = filterProviderModelsForPicker(provider.models, provider.id, {
      priceFilter,
      query,
    })
    const marker = (active: boolean): string => (active ? '● ' : '○ ')
    const isActive = (f: PriceFilter): boolean => priceFilter === f

    const action: string | symbol = await p.select<string>({
      message: `Filter ${provider.name} models (${selected.size} chosen)`,
      options: [
        {
          value: FILTER_ALL,
          label: `${marker(isActive('all'))}All models`,
          hint: `${buckets.all} available`,
        },
        {
          value: FILTER_FREE,
          label: `${marker(isActive('free'))}Free models`,
          hint: `${buckets.free} available`,
        },
        {
          value: FILTER_PAID,
          label: `${marker(isActive('paid'))}Paid models`,
          hint: `${buckets.paid} available`,
        },
        {
          value: PICKER_SEARCH,
          label: query ? `Search: "${query}"` : 'Search…',
          hint: query ? 'Edit or clear the search' : 'Filter by name, id, or brand',
        },
        {
          value: PICKER_SELECT,
          label: pc.cyan('Select models…'),
          hint: `${visible.length} shown · ${selected.size} chosen`,
        },
        navOption(PICKER_BACK, '← Go back', 'Select a different provider'),
      ],
      initialValue: PICKER_SELECT,
    })

    if (p.isCancel(action)) return null
    if (action === PICKER_BACK) return 'back'

    if (action === FILTER_ALL || action === FILTER_FREE || action === FILTER_PAID) {
      priceFilter = action === FILTER_FREE ? 'free' : action === FILTER_PAID ? 'paid' : 'all'
      continue
    }

    if (action === PICKER_SEARCH) {
      const input = await p.text({
        message: 'Search models:',
        placeholder: 'e.g. claude, sonnet, llama (empty clears)',
        initialValue: query,
      })
      if (p.isCancel(input)) continue
      query = String(input).trim()
      continue
    }

    if (visible.length === 0) {
      p.log.warn('No models match — adjust the filter or search')
      continue
    }

    const outcome = await runCustomMultiselect(visible, selected)
    if (outcome === 'filter') continue
    if (outcome === 'back') return 'back'
    if (outcome === 'cancel') return null

    const selectedIds = [...selected].slice(0, MAX_MODEL_CATALOG)
    if (selectedIds.length === 0) continue
    const boot = provider.models.find(m => m.id === selectedIds[0])!

    const confirmed = await p.confirm({
      message: `Launch with ${selectedIds.length} model${selectedIds.length === 1 ? '' : 's'} from ${provider.name}, starting with ${formatModelLabel(boot)} (${boot.id})?`,
      initialValue: true,
    })
    if (p.isCancel(confirmed)) return null
    if (!confirmed) continue
    return { selectedIds }
  }
}
