export class Router {
  constructor() {
    this.routes = {
      'GET': [],
      'POST': [],
      'PUT': [],
      'PATCH': [],
      'DELETE': [],
    }
  }

  add(method, pathname, handler) {
    this.routes[method].push({
      pattern: new URLPattern({ pathname }),
      handler,
    })
  }

  get(pathname, handler) {
    this.add('GET', pathname, handler)
  }

  post(pathname, handler) {
    this.add('POST', pathname, handler)
  }

  put(pathname, handler) {
    this.add('PUT', pathname, handler)
  }

  patch(pathname, handler) {
    this.add('PATCH', pathname, handler)
  }

  delete(pathname, handler) {
    this.add('DELETE', pathname, handler)
  }

  async route(req) {
    const method = this.routes[req.method]
    if (method) {
      if (method.length > 0) {
        for (const r of method) {
          const match = r.pattern.exec(req.url)

          if (match) {
            return await r.handler(req, match)
          }
        }
      } else {
        return new Response(
          null,
          {
            status: 404,
            statusText: 'Not Found',
          },
        )
      }
    } else {
      return new Response(
        null,
        {
          status: 405,
          statusText: 'Not allowed',
        },
      )
    }
  }
}
