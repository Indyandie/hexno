import {
  createPokemon,
  getPokemon,
  htmlGetPokemon,
  htmlNotFound,
  listPokemon,
} from './pokemon.js'

function htmlTemplate(
  title,
  body,
  meta = null,
  redirect = null,
  delay = 0,
) {
  const html = `<!doctype html>
<html lang="en" dir="auto">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    ${meta ? meta : ''}
    ${
    !redirect
      ? ''
      : '<meta http-equiv="Refresh" content="' + delay + ", url='" + redirect +
        '\'" >'
  }
    <title>${title}</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔴</text></svg>" />
  </head>
  <body>
    <header>
      <h1><a href="/web">Pokemon</a></h1>
    </header>
    ${body}
  </body>
</html>`

  return html
}

export const htmlRedirect = (title, body, delay = 0, redirect = false) => {
  return `<!doctype html>
<html lang="en" dir="auto">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${
    !redirect
      ? ''
      : '<meta http-equiv="Refresh" content="' + delay + ", url='" + redirect +
        '\'" >'
  }
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>${title}</title>
    <link
      rel="icon"
      href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔴</text></svg>"
    />
    <script src="/public/js/htmx.min.js"></script>
  </head>

  <body>
    <main>
      ${body}
    </main>
  </body>
</html>`
}

const htmlNewForm = (pokemon, prop = false, message = false) => {
  return `</main>
      <section class="pokelistmon">
        <h1>New Pokemon</h1>
        <form action="/web/new-pokemon" method="POST">
          <div>
            <label for="name">name</label>
            <span>${prop && 'name' === prop ? message : ''}</span>
            <br />
            <input type="text" name="name" value="${pokemon.name}" required />
          </div>
          <div>
            <label for="weight">weight</label>
            <span>${prop && 'weight' === prop ? message : ''}</span>
            <br />
            <input type="number" name="weight" min="1" value="${pokemon.weight}" required />
          </div>
          <div>
            <label for="height">height</label>
            <span>${prop && 'height' === prop ? message : ''}</span>
            <br />
            <input type="number" name="height" min="1" value="${pokemon.height}" required />
          </div>
          <div>
            <label for="types">types</label>
            <span>${prop && 'types' === prop ? message : ''}</span>
            <br />
            <input type="text" name="types" list="pokemonmon-types" value="${pokemon.types}" required />
            <datalist id="pokemonmon-types">
              <option value="normal"></option>
              <option value="grass"></option>
              <option value="water"></option>
              <option value="fire"></option>
              <option value="rock"></option>
            </datalist>
          </div>
          <div>
            <label for="sprite">sprite</label>
            <span>${prop && 'sprite' === prop ? message : ''}</span>
            <br />
            <input type="url" name="sprite" value="${pokemon.sprite}" required />
          </div>
          <button type="submit">Create Pokemon</button>
        </form>
      </section>
    </main>`
}

export async function htmlNewPokemonPost(pokemonObj = false) {
  const newPokemon = await createPokemon(pokemonObj)
  const { code, prop, message, id, pokemon } = newPokemon

  if (code === 201) {
    const title = `New: ${pokemon.name} [${pokemon.id}]`
    const redirectUrl = `/web/pokemon/${pokemon.id}`
    const body = `<main>
      <code>
        ${JSON.stringify(pokemon, null, '<br>')}
      </code>`
    const html = htmlRedirect(title, body, 0, redirectUrl)

    return {
      code,
      html,
    }
  } else {
    const title = '<title>New Pokemon</title>'
    const body = htmlNewForm(pokemonObj, prop, message)
    const html = htmlTemplate(title, body)

    return {
      code,
      html,
    }
  }
}

export async function htmlPageMain(query = false) {
  const pokemon = query ? await listPokemon(query) : await listPokemon()
  const now = Date.now()

  const pokeList = pokemon.map(
    (
      poke,
    ) =>
      `<li style="display: inline; background: red;" id="pokemon-${poke.id}"><a href="/web/pokemon/${poke.id}" ><figure><img src="${poke.sprite}" alt="${poke.name}" /><figcaption>${poke.name}</figcaption></figure></a>`,
  )
  pokeList.unshift('<ul id="pokemon-results">')
  pokeList.push('</ul>')

  const pokeUL = JSON.stringify(pokeList.join('')).replace(/\\"/g, '"').slice(
    1,
    -1,
  )

  const form = `<form method="GET" action="/web">
<input type="search" id="q" name="q" value="${query}">
<button>Search</button>
</form>
<a href="/web/new-pokemon"><button>Create New Pokemon</button></a>
`
  const html = form + pokeUL

  return htmlTemplate('Pokemon', html)
}

export async function htmlPokemon(id = false) {
  const pokemonReturn = id ? await getPokemon(id) : null
  const { code, pokemon } = pokemonReturn

  if (code === 200) {
    const title = pokemon.name
    const htmlReturn = await htmlGetPokemon(id)
    const { html: article } = htmlReturn
    const body = article
    console.log(body)

    return await htmlTemplate(title, body)
  }

  return
}
