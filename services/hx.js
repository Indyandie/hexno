import {
  KANTO_POKEDEX_OG,
  // createPokemon,
  // deletePokemon,
  // getPokemon,
  listPokemon,
  // updatePokemon,
} from './pokemon.js'

/**
 * Get all pokemon an return an unorder list with embedded dialogs.
 * @param {string} [query] - filter pokemon by name
 * @returns {(html|false)} HTML fragment
 */
export const hxListPokemon = async (query = false, limit = 151, offset = 1) => {
  // lsp keeps telling me await has no effect but when I remove it things break...
  const pokemon = await listPokemon(query, limit, offset)
  const now = Date.now()

  let loadMoreBtn
  offset = offset + limit
  if (offset >= KANTO_POKEDEX_OG || query !== false) {
    loadMoreBtn = null
  } else {
    const hxGet = `hx-get="/hx/pokemon?offset=${offset}&limit=${limit}"`
    const hxSwap = `hx-swap="outerHTML show:top"`
    const hxSel = `hx-select="ul > li"`
    loadMoreBtn =
      `<li><button ${hxGet} ${hxSel} ${hxSwap}>Load More</button></li>`
  }

  if (query && pokemon < 1) {
    return `<p id="pokemon-results">No pokemon results for <b>${query}</b></p>`
  } else {
    const html = pokemon.map(
      (
        poke,
      ) =>
        `<li id="pokemon-${poke.id}"><button id="show-dialog-${poke.name}"><figure><img src="${poke.sprite}" alt="${poke.name}" /><figcaption>${poke.name}</figcaption></figure></button><dialog id="${poke.name}Dialog${now}"><article hx-get="/hx/pokemon/${poke.id}" hx-trigger="intersect"></article><button autofocus>Close</button></dialog><script>const ${poke.name}Dialog${now} = document.querySelector("#${poke.name}Dialog${now}");const ${poke.name}${now}ShowButton = document.querySelector("#show-dialog-${poke.name}");const ${poke.name}${now}CloseButton = document.querySelector("#${poke.name}Dialog${now} button");${poke.name}${now}ShowButton.addEventListener("click", () => {${poke.name}Dialog${now}.showModal();});${poke.name}${now}CloseButton.addEventListener("click", () => {${poke.name}Dialog${now}.close();});</script>`,
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
