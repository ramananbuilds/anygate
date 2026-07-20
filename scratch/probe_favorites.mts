// Scratch: start the REAL claude-app favorites flow against the real registry
// and inspect the catalog + discovery payload Claude Desktop receives.
import { runClaudeAppCommand } from '../../src/agents/claude/desktop.js';

const sess = await import('../../src/agents/claude/desktop-session.js');
sess.waitForShutdown = async () => {};
sess.setupExitCleanup = () => {};
sess.backupMetaJson = () => {};
sess.writeSessionLock = () => {};
sess.cleanupSession = () => {};
sess.hasStaleSession = () => false;
sess.isConcurrentLiveSession = () => false;
sess.recoverSession = () => {};

const launch = await import('../../src/agents/claude/desktop-launch.js');
launch.launchOrRestartClaudeApp = async () => {};
launch.claudeAppSupported = () => {};
launch.isClaudeAppRunning = () => false;

const cfg = await import('../../src/agents/claude/desktop-app.js');
cfg.getClaudeDesktopHome = () => 'e:/anygate/scratch/fake-claude-home';

const router = await import('../../src/gateway/router.js');
let capturedCatalog = null;
const realStart = router.startServer;
router.startServer = async (opts) => {
  capturedCatalog = opts.catalog;
  const h = await realStart(opts);
  // close immediately so the process can exit
  await h.close();
  return h;
};

const code = await runClaudeAppCommand([], { launchProvider: '__favorites__', launchModel: '' });
console.log('EXIT CODE:', code);

if (capturedCatalog) {
  const models = capturedCatalog.list();
  console.log('CATALOG COUNT:', models.length);
  for (const m of models) {
    console.log('  -', m.id, '| providerId:', m.providerId, '| format:', m.modelFormat, '| npm:', m.npm);
  }
  const { formatGatewayAnthropicModels } = await import('../../src/gateway/models.js');
  const disc = formatGatewayAnthropicModels(models, { maskGatewayIds: true });
  console.log('DISCOVERY COUNT:', disc.data.length);
  for (const d of disc.data) {
    console.log('  DISCOVERY id:', d.id, '| name:', d.display_name);
  }
} else {
  console.log('NO CATALOG CAPTURED');
}
