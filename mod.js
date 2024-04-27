import { srvDir } from "./deps.js";
import { router } from "./routes/index.js";

const port = 8000;

/**
 * @param {Request} req
 * @returns {Promise<Response>}
 */
async function reqHandler(req) {
  const url = new URL(req.url);

  if (url.pathname.startsWith("/public")) {
    return srvDir(req, {
      fsRoot: "public",
      urlRoot: "public",
      showDirListing: true,
      showIndex: false,
    });
  }

  return await router.route(req);
}

Deno.serve(reqHandler, { port });

console.log(`Server is running on http://localhost:${port}`);
