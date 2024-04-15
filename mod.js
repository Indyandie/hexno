// import { srvFl } from './deps.js'
import { router } from './routes/index.js'

const port = 8000

async function reqHandler(req, param) {
  return await router.route(req);
}

Deno.serve(reqHandler, { port });

console.log(`Server is running on http://localhost:${port}`);

