process.env.ANYGATE_HOME = '/tmp/anygate-c4-dbg'
const m = await import('../src/gateway/server/router.js')
const { createServer } = await import('node:http')
const upstream = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(
    JSON.stringify({
      id: 'msg_json',
      type: 'message',
      usage: { input_tokens: 42, output_tokens: 17 },
    })
  )
})
await new Promise(r => upstream.listen(0, '127.0.0.1', r))
const addr = upstream.address()
const handle = await m.startServer({
  host: '127.0.0.1',
  port: 0,
  apiKey: 'k',
  serverPassword: null,
  catalog: [
    {
      id: 'claude-native',
      name: 'x',
      isFree: false,
      brand: 'Other',
      sourceBackend: 'zen',
      modelFormat: 'anthropic',
    },
  ],
  backends: {
    zen: { baseUrl: 'http://127.0.0.1:' + addr.port },
    go: { baseUrl: 'http://127.0.0.1:' + addr.port },
  },
})
try {
  const response = await fetch(handle.url + '/anthropic/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-native', messages: [{ role: 'user', content: 'hi' }] }),
  })
  console.log('status', response.status)
  console.log((await response.text()).slice(0, 600))
} catch (e) {
  console.error('ERR', e && e.message)
}
await handle.close()
upstream.close()
process.exit(0)
