import {
  createPokemon,
  deletePokemon,
  getPokemon,
  listPokemon,
  updatePokemon,
} from '../services/pokemon.js'

import { hxGetPokemon } from './hxViews.js'

function htmlTemplate(
  title,
  body,
  meta = null,
  redirect = null,
  delay = 0,
  defaultHeader = true,
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
    <link rel="stylesheet" href="/public/css/pico.min.css" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔴</text></svg>" />
    <style>
      .hide-dialog {
        display: none;
      }
    </style>
  </head>
  <body>

    ${
    defaultHeader
      ? `<header
      class="container-fluid"
      style="display: flex; justify-content: space-between"
    >
      <h1 style="margin-right: auto">
        <strong><a href="/web">Pokemon</a></strong>
      </h1>
      <nav>
        <ul>
          <li><a href="/hx">htmx version</a></li>
          <li><a href="/" class="secondary">home</a></li>
        </ul>
      </nav>
      <hr />
    </header>`
      : ''
  }

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

export const htmlNotFound = (response = false, delay = 0, redirect = false) => {
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
    <link rel="stylesheet" href="/public/css/pico.min.css" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔴</text></svg>" />
    <script src="/public/js/htmx.min.js"></script>
  </head>
  <body>
    <main class="container">
      <dialog open>
        <article>
          <h1>Page not found</h1>
          <p>These are not the pokemon you're looking for...</p>
          ${!response ? '' : '<code>' + response + '</code>'}
          <a href='/'>Main page</a>
        </article>
      <dialog>
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
  return `<header class="container" style="position: sticky; top: 0"><h1> ${
    !edit ? 'New Pokemon' : 'Edit ' + pokemon.id
  } </h1></header><main class="container">

  ${
    edit
      ? '<figure><img style="width: 240px" src="' + pokemon.sprite + '" alt="' +
        pokemon.name + '" /></figure><hr>'
      : ''
  }
        <form
          action="${
    !edit ? '/web/new-pokemon' : '/web/edit-pokemon/' + pokemon.id
  }"
          method="POST">
          <label for="name">
            name
            <input
              ${
    prop && 'name' === prop
      ? 'aria-invalid="true" aria-describedby="invalid-helper"'
      : ''
  }
              id="name" type="text" name="name" value="${pokemon.name}" required autocomplete="off"
            />
            <small>${prop && 'name' === prop ? message : ''}</small>
          </label>
          <fieldset class="grid">
            <label for="weight">
              weight
              <input
                ${
    prop && 'weight' === prop
      ? 'aria-invalid="true" aria-describedby="invalid-helper"'
      : ''
  }
                id="weight" type="number" name="weight" min="1" value="${pokemon.weight}" required />
              <small>${prop && 'weight' === prop ? message : ''}</small>
            </label>
            <label for="height">
              height
              <input
                ${
    prop && 'height' === prop
      ? 'aria-invalid="true" aria-describedby="invalid-helper"'
      : ''
  }
                id="height" type="number" name="height" min="1" value="${pokemon.height}" required />
              <small>${prop && 'height' === prop ? message : ''}</small>
            </label>
          </fieldset>
          <label for="types">
            types
            <input
              ${
    prop && 'types' === prop
      ? 'aria-invalid="true" aria-describedby="invalid-helper"'
      : ''
  }
              id="types" type="text" name="types" list="pokemonmon-types" value="${pokemon.types}" required
            />
            <small>${prop && 'types' === prop ? message : ''}</small>
            <datalist id="pokemonmon-types">
              <option value="normal"></option>
              <option value="grass"></option>
              <option value="water"></option>
              <option value="fire"></option>
              <option value="rock"></option>
            </datalist>
          </label>
          <label for="sprite">
            sprite
            <input
              ${
    prop && 'sprite' === prop
      ? 'aria-invalid="true" aria-describedby="invalid-helper"'
      : ''
  }
              id="sprite" type="url" name="sprite" value="${pokemon.sprite}" required
            />
            <small>${prop && 'sprite' === prop ? message : ''}</small>
          </label>

          <footer class="grid">
            <a href="/web">
              <button type="button" class="outline secondary">Cancel</button>
            </a>
            <button type="submit">${
    !edit ? 'Create Pokemon' : 'Update Pokemon'
  }</button>
          </footer>
        </form>
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
    const html = htmlTemplate(title, body, null, null, null, false)

    return {
      code,
      html,
    }
  }
}

export async function htmlPageMain(query = false) {
  const pokemon = query ? await listPokemon(query) : await listPokemon()

  let results = ''
  if (pokemon.length === 0) {
    results = `<p style="text-align: center; padding: 64px;">No pokemon results for <b>${query}</b></p>`
  } else {
    const pokeLiStyle =
      `style="width: 240px; list-style-type: none; margin: 0;"`
    const pokeUlStyle =
      `style="display: flex; justify-content: space-between; flex-flow: row; flex-wrap: wrap; padding: 0;"`
    const pokeArticleStyle =
      `style="width: 100%; height: 240px; display: flex; justify-content: center; align-items: center;"`

    const pokeList = pokemon.map(
      (
        poke,
      ) =>
        `<li ${pokeLiStyle} id="pokemon-${poke.id}"><a href="/web/pokemon/${poke.id}" ><article ${pokeArticleStyle}><figure style="display: flex; flex-direction: column; align-items: center; justify-content: space-between;"><img style="height: 80%; width: 100%;" src="${poke.sprite}" alt="${poke.name}" /><figcaption>${poke.name}</figcaption></figure></article></a></li>`,
    )
    pokeList.unshift(
      `<article class="container-fluid"><ul ${pokeUlStyle} class="grid" id="pokemon-results">`,
    )
    pokeList.push('</ul></article>')

    results = JSON.stringify(pokeList.join('')).replace(/\\"/g, '"').slice(
      1,
      -1,
    )
  }

  const form = `<div class="container-fluid"
style="display: flex; justify-content: space-between; gap: 32px;"><form  method="GET" action="/web" role="search">
<fieldset role="group">
  <input type="search" aria-label="search" id="q" name="q" value="${query}" placeholder="Search pokemon..." />
  <input type="submit" value="search" />
</fieldset>
</form>
<form action="/web/new-pokemon"><button style="" class="outline">Create&nbsp;pokemon</button></form>
</div>`

  const html = '<main>' + form + results + '</main>'

  return htmlTemplate('Pokemon', html)
}

export async function htmlPokemon(id = false) {
  const pokemonReturn = id ? await getPokemon(id) : null
  const { code, error, message, pokemon } = pokemonReturn

  if (code === 200) {
    const title = pokemon.name
    const htmlReturn = await hxGetPokemon(id)
    const { html: article } = htmlReturn
    const body = `<main class="container">${article}</main>`

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
  const html = htmlTemplate(title, body, null, null, null, false)

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
