const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
for (const line of envContent.split('\n')) {
  const idx = line.indexOf('=');
  if (idx > 0) process.env[line.substring(0, idx)] = line.substring(idx + 1);
}
const { createAzurePlaywrightConfig, ServiceOS } = require('@azure/playwright');
const { DefaultAzureCredential } = require('@azure/identity');

async function test() {
  const baseConfig = { projects: [] };
  const cfg = createAzurePlaywrightConfig(baseConfig, {
    exposeNetwork: '<loopback>',
    connectTimeout: 30000,
    os: ServiceOS.LINUX,
    credential: new DefaultAzureCredential(),
  });
  console.log('wsEndpoint:', cfg.use?.connectOptions?.wsEndpoint);
  const auth = cfg.use?.connectOptions?.headers?.Authorization;
  console.log('Auth header:', auth ? auth.substring(0, 50) + '...' : 'MISSING');
  console.log('Token is old PAT:', auth?.includes('eyJwd2lkIjoi') ? 'YES (old PAT!)' : 'NO (likely Entra ID)');
  console.log('Has globalSetup:', !!cfg.globalSetup);

  if (cfg.globalSetup) {
    const setupFns = Array.isArray(cfg.globalSetup) ? cfg.globalSetup : [cfg.globalSetup];
    for (const fn of setupFns) {
      console.log('globalSetup path:', fn);
    }
  }
}
test().catch(e => console.error(e));
