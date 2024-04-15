export class Router {
  constructor() {
    this.routes = {
      'GET': [],
      'POST': [],
      'PUT': []
    };
  }

  add(method, pathname, handler) {
    this.routes[method].push({ pattern: new URLPattern({pathname}), handler });
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

  async route(req) {
    for (const r of this.routes[req.method]) {
      if (r.pattern.test(req.url)) {
        return await r.handler(req);
      }
    }

    return new Response(null, { status: 404 });
  }
}

