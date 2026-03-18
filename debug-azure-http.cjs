const { DefaultAzureCredential } = require('@azure/identity');

(async () => {
  const cred = new DefaultAzureCredential();
  const token = await cred.getToken('https://management.core.windows.net/.default');
  console.log('Token acquired');

  const paths = [
    '/playwrightworkspaces/320cc9f1-81cd-452e-95f1-8914a28a8aa3/browsers',
    '/playwrightworkspaces/320cc9f1-81cd-452e-95f1-8914a28a8aa3/connect',
    '/playwrightworkspaces/320cc9f1-81cd-452e-95f1-8914a28a8aa3',
  ];

  for (const path of paths) {
    const url = 'https://eastasia.api.playwright.microsoft.com' + path + '?os=linux&api-version=2025-09-01&runId=test-456';
    try {
      const resp = await fetch(url, {
        headers: { 'Authorization': 'Bearer ' + token.token }
      });
      console.log(path, '->', resp.status, resp.statusText);
      const body = await resp.text();
      if (body.length > 0) console.log('  body:', body.substring(0, 200));
    } catch (e) {
      console.log(path, '-> ERROR:', e.message);
    }
  }
})().catch(e => console.error('Error:', e.message));
