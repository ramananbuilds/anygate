// Environment-driven flags for the UI API layer.
// VITE_USE_MOCK_API=1 enables fully mocked API responses so the dashboard
// can be developed and previewed without a running anygate backend.

export const useMockApi: boolean =
  typeof import.meta !== 'undefined' &&
  import.meta.env &&
  (import.meta.env.VITE_USE_MOCK_API === '1' || import.meta.env.VITE_USE_MOCK_API === 'true')
