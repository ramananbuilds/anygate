// src/agents/shared/completions.ts
import pc from 'picocolors';

const SUBCOMMANDS = [
  'claude',
  'claude-app',
  'codex',
  'codex-app',
  'chatgpt',
  'gemini',
  'agy',
  'antigravity',
  'antigravity-ide',
  'server',
  'ui',
  'models',
  'favorites',
  'providers',
  'doctor',
  'completions',
  'update',
];

const ROOT_FLAGS = ['--help', '--version', '--ai', '--ai --install', '--force'];

type Shell = 'bash' | 'zsh' | 'fish' | 'powershell';

function detectShell(): Shell | undefined {
  const shell = process.env['SHELL']?.toLowerCase() ?? '';
  if (shell.includes('zsh')) return 'zsh';
  if (shell.includes('bash')) return 'bash';
  if (shell.includes('fish')) return 'fish';
  if (process.env['PSModulePath'] || process.env['POWERSHELL_DISTRIBUTION_CHANNEL']) return 'powershell';
  return undefined;
}

function normalizeShell(input: string | undefined): Shell | undefined {
  const s = input?.toLowerCase().trim();
  if (s === 'bash' || s === 'zsh' || s === 'fish' || s === 'powershell' || s === 'pwsh' || s === 'ps') {
    return s === 'pwsh' || s === 'ps' ? 'powershell' : s;
  }
  return undefined;
}

function bashScript(): string {
  const cmds = SUBCOMMANDS.join(' ');
  return `# anygate bash completion
_anygate() {
  local cur prev
  COMPREPLY=()
  cur="\${COMP_WORDS[COMP_CWORD]}"
  prev="\${COMP_WORDS[COMP_CWORD-1]}"
  local subcommands='${cmds}'
  local rootflags='${ROOT_FLAGS.join(' ')}'
  if [ "\${COMP_CWORD}" -eq 1 ]; then
    COMPREPLY=( \$(compgen -W "\${subcommands} \${rootflags}" -- "\${cur}") )
    return 0
  fi
  COMPREPLY=( \$(compgen -W "\${subcommands} \${rootflags}" -- "\${cur}") )
  return 0
}
complete -F _anygate anygate
`;
}

function zshScript(): string {
  const cmds = SUBCOMMANDS.join(' ');
  return `# anygate zsh completion
#compdef anygate
_anygate() {
  local -a subcommands
  subcommands=(${cmds})
  _arguments '1:subcommand:(\${subcommands})' '*:: :_gnu_generic'
}
_anygate "$@"
`;
}

function fishScript(): string {
  const lines = SUBCOMMANDS.map(c => `complete -c anygate -n "not __fish_seen_subcommand_from ${SUBCOMMANDS.join(' ')}" -a ${c} -d 'anygate ${c}'`);
  lines.push(`complete -c anygate -s h -l help -d 'Show help'`);
  lines.push(`complete -c anygate -s v -l version -d 'Show version'`);
  return `# anygate fish completion\n${lines.join('\n')}\n`;
}

function powershellScript(): string {
  const cmds = SUBCOMMANDS.map(c => `'${c}'`).join(', ');
  return `# anygate PowerShell completion
Register-ArgumentCompleter -CommandName anygate -ScriptBlock {
  param($wordToComplete, $commandAst, $cursorPosition)
  $subcommands = @(${cmds})
  $subcommands | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
    [System.Management.Automation.CompletionResult]::new($_, $_, 'Command', "anygate $_")
  }
}
`;
}

const SCRIPTS: Record<Shell, () => string> = {
  bash: bashScript,
  zsh: zshScript,
  fish: fishScript,
  powershell: powershellScript,
};

export function runCompletionsCommand(shellArg: string | undefined): Promise<number> {
  const shell = normalizeShell(shellArg) ?? detectShell();
  if (!shell) {
    console.error(pc.red('\\nError: could not detect your shell.\\n'));
    console.error('Pass one explicitly: anygate completions <bash|zsh|fish|powershell>\\n');
    return Promise.resolve(1);
  }
  process.stdout.write(SCRIPTS[shell]());
  return Promise.resolve(0);
}
