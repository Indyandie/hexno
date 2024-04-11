const port = 8000


async function handler(req) {

  const url = new URL(req.url)

  const request_info = {
    method: req.method,
    protocol: req.protocol,
    host: req.host,
    path_name: url.pathname,
    // queryString_name: url.searchParams.get("name"),
  }

    let bodyEmpty = ""
    let optGood = { status: 200, statusText: "Ok" }
  if (request_info.method == "GET") {
    return new Response(bodyEmpty, {...optGood})
  } else {
    return new Response(bodyEmpty, { status: 409, statusText: "Not allowed" })
  }
}

Deno.serve({ port }, handler)

console.log(`Server is running on http://localhost:${port}`);

