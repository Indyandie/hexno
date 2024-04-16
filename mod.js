import { srvDir } from './deps.js'
import { router } from './routes/index.js'

const port = 8000

async function reqHandler(req, param) {
  const url = new URL(req.url)

  console.log(url.pathname)

  if (url.pathname.startsWith("/public")) {
    return srvDir(req, {
      fsRoot: "public",
      urlRoot: "public",
      showDirListing: true,
      showIndex: false
    });
  }

  return await router.route(req);
}

Deno.serve(reqHandler, { port });

console.log(`Server is running on http://localhost:${port}`);

