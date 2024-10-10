import {
  createPokemon,
  deletePokemon,
  getPokemon,
  KANTO_POKEDEX_OG,
  listPokemon,
  updatePokemon,
} from '../services/pokemon.js'

import { htmlNotFound } from './webViews.js'

// CSS
const pokeLiStyle =
  'style="cursor: pointer; margin: 0 0 32px 0; width: 240px; height: 240px; list-style-type: none;"'
const pokeImgStyle = 'style="height: auto; width: 80%;"'

const htmlNewForm = (
  pokemon,
  prop = false,
  message = false,
  edit = false,
) => {
  const editHxSel = `hx-select="article"`
  const hxSwap = `hx-swap="outerHTML"`
  const hxTarget = `hx-target="closest article"`
  const hx = `${hxTarget} ${hxSwap}`

  return `<article style="padding-top: 0;">
  <header style="position: sticky; top: 0; display: flex; justify-content: space-between; align-items: center;">
    <h2> ${!edit ? 'New Pokemon' : 'Edit ' + pokemon.id} </h2>
    <form class="hide-dialog" method="dialog"><button onclick="closeModalUtils()" aria-label="Close" rel="prev"></button></form>
  </header>
  <figure>
    ${
    edit
      ? '<img style="max-height: 240px;" src="' + pokemon.sprite +
        '" alt="${name}" />'
      : ''
  }
  </figure>
  <hr>
  <form
  ${
    !edit
      ? 'hx-put="/hx/pokemon"'
      : 'hx-patch="/hx/pokemon/' + pokemon.id + '"'
  } ${hx} ${editHxSel}
  >
    <label for="name">
      name
      <input
        ${prop && 'name' === prop ? 'aria-invalid="true"' : ''}
        id="name" type="text" name="name" value="${
    pokemon !== undefined ? pokemon.name : ''
  }" required autocomplete="off"
      />
      <small>${prop && 'name' === prop ? message : ''}</small>
    </label>
    <fieldset class="grid">
      <label for="weight">
        weight
        <input
          ${prop && 'weight' === prop ? 'aria-invalid="true"' : ''}
          id="weight" type="number" name="weight" min="1" value="${
    pokemon !== undefined ? pokemon.weight : ''
  }" required
        />
        <small>${prop && 'weight' === prop ? message : ''}</small>
      </label>
      <label for="height">
        height
        <input
          ${prop && 'height' === prop ? 'aria-invalid="true"' : ''}
          id="height" type="number" name="height" min="1" value="${
    pokemon !== undefined ? pokemon.height : ''
  }" required
        />
        <small>${prop && 'height' === prop ? message : ''}</small>
      </label>
    </fieldset>
    <label for="types">
      types
      <input
        ${prop && 'types' === prop ? 'aria-invalid="true"' : ''}
        id="types" type="text" name="types" list="pokemonmon-types" value="${
    pokemon !== undefined ? pokemon.types : ''
  }" required
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
        ${prop && 'sprite' === prop ? 'aria-invalid="true"' : ''}
        id="sprite" type="url" name="sprite" value="${
    pokemon !== undefined ? pokemon.sprite : ''
  }" required
      />
      <small>${prop && 'sprite' === prop ? message : ''}</small>
    </label>
    <button type="submit">${
    !edit ? 'Create Pokemon' : 'Update Pokemon'
  }</button>
  </form>
</article>`
}

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
    <script src="/public/js/htmx.min.js"></script>
    <link rel="stylesheet" href="/public/css/pico.min.css" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔴</text></svg>" />
    <style>
      .hide-dialog {
        display: none;
      }
    </style>
  </head>
  <body>
    <header
      class="container-fluid"
      style="display: flex; justify-content: space-between"
    >
      <h1 style="margin-right: auto">
        <strong><a href="/hx">Pokemon</a></strong>
      </h1>
      <nav>
        <ul>
          <li><a href="/web">web version</a></li>
          <li><a href="/" class="secondary">home</a></li>
        </ul>
      </nav>
      <hr />
    </header>
    <main class="container-fluid">
      ${body}
    </main>
  </body>
</html>`

  return html
}

/**
 * Get all pokemon an return an unorder list with embedded dialogs.
 * @param {string} [query] - filter pokemon by name
 * @returns {(html|false)} HTML fragment
 */
export const hxListPokemon = async (
  query = false,
  limit = 151,
  offset = 1,
  paging = false,
) => {
  // lsp keeps telling me await has no effect but when I remove it things break...
  const pokemon = await listPokemon(query, limit, offset)
  const now = Date.now()

  let loadMoreBtn
  offset = offset + limit
  if (paging != -false) {
    if (offset >= KANTO_POKEDEX_OG || query !== false) {
      loadMoreBtn = null
    } else {
      const hxSel = `hx-select="ul > li"`
      if (paging === 'button') {
        const hxSwap = `hx-swap="outerHTML show:top"`
        const hxGet =
          `hx-get="/hx/pokemon?offset=${offset}&limit=${limit}&paging=button"`
        loadMoreBtn =
          `<li ${pokeLiStyle}><button ${hxGet} ${hxSel} ${hxSwap}>Load More</button></li>`
      } else if (paging === 'infinite') {
        const hxSwap = `hx-swap="outerHTML"`
        const hxGet =
          `hx-get="/hx/pokemon?offset=${offset}&limit=${limit}&paging=infinite"`
        loadMoreBtn =
          `<li ${pokeLiStyle} hx-trigger="revealed delay:1s" ${hxGet} ${hxSel} ${hxSwap}><div style="margin: auto; height: 100%; text-align: center; line-height: 240px;" aria-busy="true">Loading more...</div></li>`
      }
    }
  } else {
    loadMoreBtn = null
  }

  if (query && pokemon < 1) {
    return `<p id="pokemon-results" style="text-align: center; padding: 64px;">No pokemon results for <b>${query}</b></p>`
  } else {
    const html = pokemon.map(
      (
        poke,
      ) => {
        const { id, name, sprite } = poke

        // htmx
        const hxGet = `hx-get="/hx/pokemon/${id}"`
        const hxTrigger = `hx-trigger="intersect"`
        const hxSel = `hx-select="article"`
        const hxSwap = `hx-swap="innerHTML"`
        const hxTarget = `hx-target="this"`
        const hx = `${hxGet} ${hxTrigger} ${hxSel} ${hxTarget} ${hxSwap}`
        const articleHx =
          `<article style="display: flex; align-items: center; justify-content: center; min-height: 50vh; height: 100%;" aria-busy="true">loading...</article>`

        const btnId = `show-dialog-${name}`
        const pokeUTID = `${name}${now}`
        const dialogId = `${pokeUTID}Dialog`

        // html
        const pokeFigure =
          `<figure><img src="${sprite}" alt="${name}" ${pokeImgStyle} /><figcaption>${name}</figcaption></figure>`
        const pokeDialog =
          `<dialog id="${dialogId}" ${hx}>${articleHx}</dialog>`

        // javascript
        const pokeScript =
          `<script>const ${dialogId} = document.querySelector("#${dialogId}");const ${pokeUTID}ShowButton = document.querySelector("#${btnId}");${pokeUTID}ShowButton.addEventListener("click", () => {openModalUtils();${dialogId}.showModal();});</script>`

        return `<li id="pokemon-${id}-list" class="poke-${id}" ${pokeLiStyle}><button class="outline secondary" style="display: flex; flex-direction: column; flex; justify-content: flex-end; align-items: center; gap: 16px; overflow: hidden; width: 100%; height: 100%;" id="${btnId}">${pokeFigure}</button>${pokeDialog}${pokeScript}</li>`
      },
    )

    const pokeUlStyle =
      'style="width: 100%; display: flex; flex-direction: row; flex-wrap: wrap; justify-content: space-between; width: 100%; padding: 0;"'

    html.unshift(
      `<ul class="container-fluid" ${pokeUlStyle} id="pokemon-results">`,
    )
    html.push(loadMoreBtn)
    html.push('</ul>')

    return JSON.stringify(html.join('')).replace(/\\"/g, '"').slice(
      1,
      -1,
    )
  }
}

/**
 * Get a pokemon and return an article.
 * @param {number} id - pokemon id
 * @returns {(html|false)} HTML fragment
 */
export const hxGetPokemon = async (id, pokedexLink = false) => {
  const { code, pokemon: poke } = await getPokemon(id)

  if (code === 200) {
    const { id, name, cries, weight, height, types, sprite, official } = poke

    const articleID = `article${name}${id}`

    // htmx
    const hxSwap = `hx-swap="outerHTML"`
    const hxTarget = `hx-target="#${articleID}"`

    // edit
    const editHxSel = `hx-select="article"`
    const editAction =
      `<a href="/web/edit-pokemon/${id}" hx-get="/hx/pokemon/${id}/edit" ${editHxSel} ${hxSwap} ${hxTarget}"><button>edit</button></a>`

    // delete
    const deleteHxSel = `hx-select="dialog"`
    const deleteHxSwap = `hx-swap="afterbegin"`
    const deleteHxTarget = `hx-target="body"`
    const deleteHxConfirm = `hx-confirm="Delete ${name}?"`
    const deleteAction =
      `<button hx-delete="/hx/pokemon/${id}" ${deleteHxSel} ${deleteHxSwap} ${deleteHxTarget} ${deleteHxConfirm} form="delete-pokemon" formaction="/web/delete-pokemon/${id}" formmethod="POST" class="outline secondary">delete</button>`

    const customActions = !official
      ? `<footer class="container grid" style="display: flex; justify-content: space-between">${deleteAction}${editAction}</footer><form style="display: none;" id="delete-pokemon"><script>htmx.remove("#delete-pokemon")</script></form>`
      : ''

    const criesTr = cries
      ? `<tr><th>cries</th><td><audio controls controlslist="nodownload"><source src="${cries}" type="audio/ogg"></source><p>audio is not supported</p></audio></td></tr>`
      : ''

    pokedexLink = pokedexLink ? `&nbsp;<a href="/hx/pokedex/${id}">➔</a>` : ''
    const closeButton =
      `<form class="hide-dialog" method="dialog"><button onclick="closeModalUtils()" aria-label="Close" rel="prev"></button></form>`

    const html =
      `<article id="${articleID}"><header style="display: flex; justify-content: space-between; align-items: center;"><h1>${name}${pokedexLink}</h1>${closeButton}</header><figure style="display: flex; justify-content: center;"><img style="width: 50%; max-width: 320px;" src="${sprite}" alt="${name}" /></figure><table><tr><th scope="row">weight</th><td>${weight}</td></tr><tr><th scope="row">height</th><td>${height}</td></tr><tr><th scope="row">type</th><td>${types}</td></tr>${criesTr}</table>${customActions}</article>`

    return {
      code,
      html,
    }
  }

  return {
    code,
    html: 'not found',
  }
}

export const hxEditPokemon = async (pokemonId, pokemonObj = null) => {
  if (pokemonObj === null) {
    const pokeReturn = await getPokemon(pokemonId)
    const { code, pokemon, error, message } = pokeReturn

    if (!pokemon) {
      const body = `<code>${error}: ${message}</code><br><br>`
      return { code: 404, html: body }
    }

    if (pokemon.official) {
      const officialForbidden = `<b>${pokemon.name}</b> cannot be edited`
      return {
        code: 403,
        html: officialForbidden,
      }
    }

    if (code === 200) {
      return {
        code,
        html: await htmlNewForm(pokemon, false, false, true),
      }
    }
  } else {
    const pokeReturn = await updatePokemon(pokemonObj)
    const { code, pokemon, prop, error, message } = pokeReturn

    if (code === 403) {
      const officialForbidden = !pokemon
        ? `<h1>${error}</h1><code>${message}</code>`
        : `<b>${pokemon.name}</b> cannot be edited`
      return {
        code,
        html: officialForbidden,
      }
    }

    if (code === 404) {
      const body = `<code>${error}: ${message}</code><br><br>`
      return {
        code,
        html: body,
      }
    }

    if (code === 200) {
      return hxGetPokemon(pokemonId)
    }

    return {
      code: 200, // override error status
      html: htmlNewForm(pokemonObj, prop, message, true),
    }
  }
}

export async function hxNewPokemon(pokemonObj = false) {
  if (pokemonObj === false) {
    return {
      code: 200,
      html: await htmlNewForm(),
    }
  }

  const newPokemon = await createPokemon(pokemonObj)
  const { code, prop, message, pokemon } = newPokemon

  if (code === 201) {
    const { html } = await hxGetPokemon(pokemon.id)

    return {
      code,
      html,
    }
  } else {
    const html = await htmlNewForm(pokemonObj, prop, message)

    return {
      code: 200,
      html,
    }
  }
}

export const hxDeletePokemon = async (pokemonId) => {
  const { code, error, message, pokemon } = await deletePokemon(pokemonId)

  if (code === 200) {
    const { id, name } = pokemon
    const deletedPokemon = await JSON.stringify(pokemon, null, '\n')

    const message = `<p><strong>${name} (${id}) has been deleted</strong><p>`
    const object = `<pre><code>${deletedPokemon}</code></pre>`
    const closeButton = `<form method="dialog"><button>close</button></form>`
    const dialogId = `delete-notification-${id + name}`
    const script = `<script>
    const rmPoke${id} = document.querySelectorAll(".poke-${id}")
    rmPoke${id}.forEach(el => el.remove())
    const rmNotification${id + name} = document.querySelector("#${dialogId}")

    setTimeout(() => {
      rmNotification${id + name}.close()
      closeModalUtils()
      setTimeout(() => {
        rmNotification${id + name}.remove()
      }, 1000)
    }, 5000)
</script>`

    const html =
      `<dialog open id="${dialogId}" style="position: fixed; top: 0;"><article>${message}${object}${script}${closeButton}</article></dialog>`

    return {
      code,
      html,
    }
  } else {
    const html = `<pre><code>${error}: ${message}</code></pre><br><br>`
    console.log(html)

    return { code, html }
  }
}

export async function hxPokedex(id = false) {
  const pokemonReturn = id ? await getPokemon(id) : null
  const { code, pokemon } = pokemonReturn

  if (code === 200) {
    const title = pokemon.name
    const htmlReturn = await hxGetPokemon(id)
    const { html: article } = htmlReturn
    const body = article

    const html = htmlTemplate(title, body)

    return { code: 200, html }
  }
  return { code: 200, html: htmlNotFound() }
}
