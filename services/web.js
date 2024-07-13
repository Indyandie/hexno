import {
  createPokemon,
  deletePokemon,
  getPokemon,
  htmlGetPokemon,
  listPokemon,
  updatePokemon,
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

const htmlForbidden = (response, delay = 0, redirect = false) => {
  return `<!doctype html>
<html lang="en" dir="auto">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    ${
    !redirect
      ? ''
      : '<meta http-equiv="Refresh" content="' + delay + ", url='" + redirect +
        '\'" >'
  }
    <title>Forbidden</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔴</text></svg>" />
    <script src="/public/js/htmx.min.js"></script>
  </head>
  <body>
    <main>
      <section>
        <h1>Forbidden</h1>
        <code>${response}</code>
      </section>
    </main>
  </body>
</html>`
}

const htmlNotFound = (response = false, delay = 0, redirect = false) => {
  return `<!doctype html>
<html lang="en" dir="auto">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    ${
    !redirect
      ? ''
      : '<meta http-equiv="Refresh" content="' + delay + ", url='" + redirect +
        '\'" >'
  }
    <title>Not Found</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔴</text></svg>" />
    <script src="/public/js/htmx.min.js"></script>
  </head>
  <body>
    <main>
      <section>
        <h1>Not found</h1>
        <p>These are not the pokemon you are looking</p>
        ${!response ? '' : '<code>' + response + '</code>'}
        <a href='/web'>Main page</a>
      </section>
    </main>
  </body>
</html>`
}

const htmlNewForm = (
  pokemon,
  prop = false,
  message = false,
  edit = false,
) => {
  return `</main>
      <section class="pokelistmon">
        <h1> ${!edit ? 'New Pokemon' : 'Edit ' + pokemon.id} </h1>
  ${edit ? '<img src="' + pokemon.sprite + '" alt="${pokemon.name}" />' : ''}
        <form
          action="${
    !edit ? '/web/new-pokemon' : '/web/edit-pokemon/' + pokemon.id
  }"
          method="POST">
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
          <button type="submit">${
    !edit ? 'Create Pokemon' : 'Update Pokemon'
  }</button>
        </form>
      </section>
    </main>`
}

export async function htmlNewPokemonPost(pokemonObj = false) {
  const newPokemon = await createPokemon(pokemonObj)
  const { code, prop, message, pokemon } = newPokemon

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
  const { code, error, message, pokemon } = pokemonReturn

  if (code === 200) {
    const title = pokemon.name
    const htmlReturn = await htmlGetPokemon(id)
    const { html: article } = htmlReturn
    const body = article

    const html = htmlTemplate(title, body)

    return { code, html }
  }

  const body = `<code>${error}: ${message}</code><br><br>`
  const html = htmlNotFound(body)

  return {
    code,
    html,
  }
}

const htmlEditForm = (pokemon, prop = false, message = false) => {
  const title = 'Edit ' + pokemon.id
  const body = htmlNewForm(pokemon, prop, message, true)
  const html = htmlTemplate(title, body)

  return html
}

const htmlUpdatedPokemon = (pokemon) => {
  const body = `<h1>Updated!</h1><code>${
    JSON.stringify(pokemon, null, '<br>')
  }</code>`
  const redirectUrl = `/web/pokemon/${pokemon.id}`
  const title = `Updated: ${pokemon.name} [${pokemon.id}`
  const html = htmlTemplate(title, body, null, redirectUrl, 0)

  return html
}

/**
 * Edit a pokemon form.
 * @param {number} pokemonId - pokemon id
 * @param {Object|null} [pokemonObj] - pokemon object
 * @returns {(html|false)} HTML fragment
 */
export const htmlEditPokemon = async (pokemonId, pokemonObj = null) => {
  if (pokemonObj === null) {
    const pokeReturn = await getPokemon(pokemonId)
    const { code, pokemon, error, message } = pokeReturn

    if (!pokemon) {
      const body = `<code>${error}: ${message}</code><br><br>`
      return { code: 404, html: htmlNotFound(body) }
    }

    if (pokemon.official) {
      const officialForbidden = `<b>${pokemon.name}</b> cannot be edited`
      const redirectUrl = `/pokemon/${pokemon.id}`
      return {
        code: 403,
        html: htmlForbidden(
          officialForbidden,
          0,
          redirectUrl,
        ),
      }
    }

    if (code === 200) {
      return {
        code,
        html: await htmlEditForm(pokemon),
      }
    }
  } else {
    const pokeReturn = await updatePokemon(pokemonObj)
    const { code, pokemon, prop, error, message } = pokeReturn

    if (code === 403) {
      const officialForbidden = !pokemon
        ? `<h1>${error}</h1><code>${message}</code>`
        : `<b>${pokemon.name}</b> cannot be edited`
      const redirectUrl = `/pokemon/${pokemonId}`

      return {
        code,
        html: htmlForbidden(
          officialForbidden,
          0,
          redirectUrl,
        ),
      }
    }

    if (code === 404) {
      const body = `<code>${error}: ${message}</code><br><br>`
      return {
        code,
        html: htmlNotFound(body),
      }
    }

    if (code === 200) {
      return {
        code,
        html: htmlUpdatedPokemon(pokemon),
      }
    }

    return {
      code,
      html: await htmlEditForm(pokemonObj, prop, message),
    }
  }
}

export const htmlDeletePokemonPost = async (pokemonId) => {
  const { code, error, message, pokemon } = await deletePokemon(pokemonId)

  if (code === 200) {
    const { id, name } = pokemon
    const title = `Deleted: ${name} [${id}]`
    const body = `<code>${JSON.stringify(pokemon, null, '<br>')}</code>`
    const redirectUrl = '/web'

    const html = htmlRedirect(title, body, 0, redirectUrl)

    return {
      code,
      html,
    }
  } else {
    const body = `<code>${error}: ${message}</code><br><br>`
    const html = htmlNotFound(body)

    return { code, html }
  }
}
