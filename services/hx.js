import {
  // createPokemon,
  // deletePokemon,
  getPokemon,
  KANTO_POKEDEX_OG,
  listPokemon,
  // updatePokemon,
} from './pokemon.js'

import { htmlNotFound } from './web.js'

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
          `<li><button ${hxGet} ${hxSel} ${hxSwap}>Load More</button></li>`
      } else if (paging === 'infinite') {
        const hxSwap = `hx-swap="outerHTML"`
        const hxGet =
          `hx-get="/hx/pokemon?offset=${offset}&limit=${limit}&paging=infinite"`
        loadMoreBtn =
          `<li><div hx-trigger="revealed" ${hxGet} ${hxSel} ${hxSwap}>Load More</div></li>`
      }
    }
  } else {
    loadMoreBtn = null
  }

  if (query && pokemon < 1) {
    return `<p id="pokemon-results">No pokemon results for <b>${query}</b></p>`
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
        const hx = `${hxGet} ${hxTrigger} ${hxSel}`
        const articleHx = `<article ${hx}></article>`

        const btnId = `show-dialog-${name}`
        const pokeUTID = `${name}${now}`
        const dialogId = `${pokeUTID}Dialog`

        // html
        const pokeFigure =
          `<figure><img src="${sprite}" alt="${name}" /><figcaption>${name}</figcaption></figure>`
        const pokeDialog =
          `<dialog id="${dialogId}">${articleHx}<button autofocus>Close</button></dialog>`

        // javascript
        const pokeScript =
          `<script>const ${dialogId} = document.querySelector("#${dialogId}");const ${pokeUTID}ShowButton = document.querySelector("#${btnId}");const ${pokeUTID}CloseButton = document.querySelector("#${dialogId} button");${pokeUTID}ShowButton.addEventListener("click", () => {${dialogId}.showModal();});${pokeUTID}CloseButton.addEventListener("click", () => {${dialogId}.close();});</script>`

        return `<li id="pokemon-${id}"><button id="${btnId}">${pokeFigure}</button>${pokeDialog}${pokeScript}`
      },
    )
    html.unshift('<ul id="pokemon-results">')
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
export const hxGetPokemon = async (id) => {
  const { code, pokemon: poke } = await getPokemon(id)

  if (code === 200) {
    const { id, name, cries, weight, height, types, sprite, official } = poke
    const deleteForm = !official
      ? `
      <form method="POST" action="/web/delete-pokemon/${id}" >
        <button type="sumbit">delete</button>
      </form>
      <a href="/web/edit-pokemon/${id}">
        <button>edit</button>
      </a>
      `
      : ''

    const criesTr = cries
      ? `<tr><th>cries</th><td><audio controls controlslist="nodownload"><source src="${cries}" type="audio/ogg"></source><p>audio is not supported</p></audio></td></tr>`
      : ''

    const html =
      `<article><h1>${name}</h1><img src="${sprite}" alt="${name}" /><table><tr><th>weight</th><td>${weight}</td></tr><tr><th>height</th><td>${height}</td></tr><tr><th>type</th><td>${types}</td></tr>${criesTr}</table>${deleteForm}</article>`

    return {
      code,
      html,
    }
  }

  return {
    code,
    html: htmlNotFound(),
  }
}
