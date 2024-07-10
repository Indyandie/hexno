import {
  createPokemon,
  deletePokemon,
  getPokemon,
  htmlEditPokemon,
  htmlGetPokemon,
  htmlListPokemon,
  listPokemon,
  updatePokemon,
} from '../services/pokemon.js'

import { htmlPageMain } from '../services/web.js'

const status404 = new Response(
  null,
  {
    status: 404,
    statusText: 'Not Found',
  },
)

// API

export const createPokemonCtrl = async (req) => {
  const pokeReq = await req.json()
  const pokeRes = await createPokemon(pokeReq)
  const { code, error, message, pokemon } = pokeRes

  if (!pokeRes) {
    return status404
  }

  let response
  if (code >= 400) {
    response = {
      error,
      message,
    }
  } else {
    response = pokemon
  }

  return new Response(
    JSON.stringify(response),
    {
      status: code,
      headers: {
        'Content-Type': 'text/json; charset=utf-8',
      },
    },
  )
}

export const listPokemonCtrl = async (req) => {
  const url = new URL(req.url)
  const query = url.searchParams.get('q')

  return new Response(
    JSON.stringify(await listPokemon(query)),
    {
      headers: {
        'content-type': 'text/json; charset=utf-8',
      },
    },
  )
}

export const getPokemonCtrl = async (_req, match) => {
  const pokeId = match.pathname.groups.id
  const pokeRes = await getPokemon(pokeId)
  const { code } = pokeRes
  let response

  if (!pokeRes) {
    return status404
  }

  if (code === 200) {
    const { pokemon } = pokeRes
    response = pokemon
  } else {
    const { error, message } = pokeRes
    response = {
      error,
      message,
    }
  }

  return new Response(
    JSON.stringify(response),
    {
      status: code,
      headers: {
        'Content-Type': 'text/json; charset=utf-8',
      },
    },
  )
}

export const updatePokemonCtrl = async (req, match) => {
  const pokeId = parseInt(match.pathname.groups.id)
  const pokeReq = await req.json()
  pokeReq.id = pokeId
  const pokeRes = await updatePokemon(pokeReq)
  const { code, error, message, pokemon } = pokeRes

  if (!pokeRes) {
    return status404
  }

  let response
  if (code >= 400) {
    response = {
      error,
      message,
    }
  } else {
    response = pokemon || {
      error,
      message,
    }
  }

  return new Response(
    JSON.stringify(response),
    {
      status: code,
      headers: {
        'Content-Type': 'text/json; charset=utf-8',
      },
    },
  )
}

export const deletePokemonCtrl = async (_req, match) => {
  const pokeId = parseInt(match.pathname.groups.id)
  const pokeRes = await deletePokemon(pokeId)
  const { code, error, message, pokemon } = pokeRes

  if (!pokeRes) {
    return status404
  }

  let response
  if (code >= 400) {
    response = {
      error,
      message,
    }
  } else {
    response = {
      error,
      message,
      pokemon,
    }
  }

  return new Response(
    JSON.stringify(response),
    {
      status: code,
      headers: {
        'Content-Type': 'text/json; charset=utf-8',
      },
    },
  )
}

// web

export async function webNewPokemonCtrl(req) {
  const url = new URL(req.url)
  const origin = url.origin
  const formData = await req.formData()
  const pokemon = {
    name: formData.get('name'),
    height: formData.get('height'),
    weight: formData.get('weight'),
    types: formData.get('types'),
    sprite: formData.get('sprite'),
  }

  const newPokemon = await createPokemon(pokemon)
  const { code, prop, message, id, pokemon: pokemonObj } = newPokemon

  if (code === 201) {
    const body = `<!doctype html>
<html lang="en" dir="auto">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Refresh" content="0, url='/pokemon/${pokemonObj.id}'" >
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>New: ${pokemonObj.name} [${pokemonObj.id}]</title>
    <link
      rel="icon"
      href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔴</text></svg>"
    />
    <script src="/public/js/htmx.min.js"></script>
  </head>

  <body>
    <main>
      <code>
        ${JSON.stringify(pokemonObj, null, '<br>')}
      </code>
    </main>
  </body>
</html>`

    return new Response(
      body,
      {
        status: 201,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Location': `${origin}/pokemon/${id}`,
        },
      },
    )
  } else {
    const body = `<!doctype html>
<html lang="en" dir="auto">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>New Pokemon</title>
    <link
      rel="icon"
      href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔴</text></svg>"
    />
    <script src="/public/js/htmx.min.js"></script>
  </head>

  <body>
    <main>
      <section class="pokelist">
        <h1>New Pokemon</h1>
        <form action="/pokemon/new" method="POST">
          <div>
            <label for="name">name</label>
            <span>${'name' === prop ? message : ''}</span>
            <br />
            <input type="text" name="name" value="${pokemon.name}" required />
          </div>
          <div>
            <label for="weight">weight</label>
            <span>${'weight' === prop ? message : ''}</span>
            <br />
            <input type="number" name="weight" min="1" value="${pokemon.weight}" required />
          </div>
          <div>
            <label for="height">height</label>
            <span>${'height' === prop ? message : ''}</span>
            <br />
            <input type="number" name="height" min="1" value="${pokemon.height}" required />
          </div>
          <div>
            <label for="types">types</label>
            <span>${'types' === prop ? message : ''}</span>
            <br />
            <input type="text" name="types" list="pokemon-types" value="${pokemon.types}" required />
            <datalist id="pokemon-types">
              <option value="normal"></option>
              <option value="grass"></option>
              <option value="water"></option>
              <option value="fire"></option>
              <option value="rock"></option>
            </datalist>
          </div>
          <div>
            <label for="sprite">sprite</label>
            <span>${'sprite' === prop ? message : ''}</span>
            <br />
            <input type="url" name="sprite" value="${pokemon.sprite}" required />
          </div>
          <button type="submit">Save</button>
        </form>
      </section>
    </main>
  </body>
</html>`

    return new Response(
      body,
      {
        status: code,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Location': origin,
        },
      },
    )
  }
}

export async function webHomePokemonCtrl(req, match) {
  const url = new URL(req.url)
  const query = url.searchParams.get('q') || ""
  const html = await htmlPageMain(query)

  return new Response(
    html,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    },
  )
}

export async function webEditPokemonCtrl(_req, match) {
  const pokeId = match.pathname.groups.id
  const { code, html } = await htmlEditPokemon(pokeId)

  return new Response(
    html,
    {
      status: code,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    },
  )
}

export async function webUpdatePokemonCtrl(req, match) {
  const pokeId = match.pathname.groups.id
  // const url = new URL(req.url)
  // const origin = url.origin
  const formData = await req.formData()
  const pokemonForm = {
    id: pokeId,
    name: formData.get('name'),
    height: formData.get('height'),
    weight: formData.get('weight'),
    types: formData.get('types'),
    sprite: formData.get('sprite'),
  }

  // console.log("form", pokemonForm)

  const { code, html } = await htmlEditPokemon(pokeId, pokemonForm)

  return new Response(
    html,
    {
      status: code,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    },
  )
}

export async function webDeletePokemonCtrl(req, match) {
  const pokeId = parseInt(match.pathname.groups.id)
  const pokeRes = await deletePokemon(pokeId)
  const url = new URL(req.url)
  const origin = url.origin

  const { code, message, pokemon } = pokeRes

  if (!pokeRes) {
    return status404
  }

  if (code === 200) {
    const { id, name } = pokemon
    const body = `<!doctype html>
<html lang="en" dir="auto">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Refresh" content="0, url='/'" >
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Deleted: ${name} [${id}]</title>
    <link
      rel="icon"
      href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔴</text></svg>"
    />
    <script src="/public/js/htmx.min.js"></script>
  </head>

  <body>
    <main>
      <code>
        ${JSON.stringify(pokemon, null, '<br>')}
      </code>
    </main>
  </body>
</html>`

    return new Response(
      body,
      {
        status: code,
        // status: 302,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Location': `${origin}/pokemon/${id}`,
        },
      },
    )
  } else {
    const body = `<!doctype html>
<html lang="en" dir="auto">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>New Pokemon</title>
    <link
      rel="icon"
      href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔴</text></svg>"
    />
    <script src="/public/js/htmx.min.js"></script>
  </head>

  <body>
    <main>
      <h1>Client Error</h1>
      <code>${url}</code>
      <p>${message}</p>
    </main>
  </body>
</html>`

    return new Response(
      body,
      {
        status: code,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Location': origin,
        },
      },
    )
  }
}

// htmx

export const hxListPokemonCtrl = async (req) => {
  const url = new URL(req.url)
  const query = url.searchParams.get('q')

  return new Response(
    await htmlListPokemon(query),
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    },
  )
}

export const hxGetPokemonCtrl = async (_req, match) => {
  const pokeId = match.pathname.groups.id
  const pokeRes = await htmlGetPokemon(pokeId)
  const { code, html } = pokeRes
  let response

  if (!pokeRes) {
    return status404
  }

  if (code === 200) {
    response = html
  } else {
    // const { error, message } = pokeRes
    response = html
  }

  return new Response(
    response,
    {
      status: code,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    },
  )
}

// export const hxDeletePokemonCtrl = async (_req, match) => {
//   const pokeId = parseInt(match.pathname.groups.id)
//   const pokeRes = await htmlGetPokemon(pokeId)

//   if (!pokeRes) {
//     return status404
//   }

//   return new Response(
//     pokeRes,
//     {
//       headers: {
//         'Content-Type': 'text/html; charset=utf-8',
//       },
//     },
//   )
// }
