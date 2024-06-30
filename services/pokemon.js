import { csvParse } from '../deps.js'

/**
 * An HTML fragment.
 * @typedef {string} html - HTML fragment
 */

/**
 * @typedef {Object} Pokemon
 * @property {number} id
 * @property {string} name
 * @property {number} weight
 * @property {number} height
 * @property {string} types
 * @property {string} sprite - URL
 * @property {string} cries - URL
 */

/**
 * Read the data from `./models/pokemon.csv`, converts it into an object, and returns it. If a `query` is passed the object is filter by the pokemon name.
 * @param {string} [query] - filter pokemon by name
 * @returns {Pokemon[]} array of pokemon: id, name, weight, height, types, sprite, cries
 */
export const getAllPokemon = async (query) => {
  const pokemon = csvParse(await Deno.readTextFile('./models/pokemon.csv'), {
    skipFirstRow: true,
    strip: true,
  })

  if (query) {
    const regex = new RegExp(query)

    return pokemon.filter((poke) => {
      return poke.name.match(regex)
    })
  }

  return await pokemon
}

/**
 * Get a pokemon by `id`.
 * @param {number} id - pokemon id
 * @returns {(Pokemon|false)}
 */
export const getPokemon = async (id) => {
  let pokemon = await getAllPokemon()
  pokemon = pokemon[id - 1]

  if (pokemon) {
    return pokemon
  }

  return false
}

/**
 * Get all pokemon an return an unorder list with embedded dialogs.
 * @param {string} [query] - filter pokemon by name
 * @returns {(html|false)} HTML fragment
 */
export const htmxAllPokemon = async (query) => {
  const pokemon = query ? await getAllPokemon(query) : await getAllPokemon()
  const now = Date.now()

  const htmx = pokemon.map((
    poke,
  ) => (`<li id="pokemon-${poke.id}"><button id="show-dialog-${poke.name}"><figure><img src="${poke.sprite}" alt="${poke.name}" /><figcaption>${poke.name}</figcaption></figure></button><dialog id="${poke.name}Dialog${now}"><article hx-get="/hx/pokemon/${poke.id}" hx-trigger="intersect"></article><button autofocus>Close</button></dialog><script>const ${poke.name}Dialog${now} = document.querySelector("#${poke.name}Dialog${now}");const ${poke.name}${now}ShowButton = document.querySelector("#show-dialog-${poke.name}");const ${poke.name}${now}CloseButton = document.querySelector("#${poke.name}Dialog${now} button");${poke.name}${now}ShowButton.addEventListener("click", () => {${poke.name}Dialog${now}.showModal();});${poke.name}${now}CloseButton.addEventListener("click", () => {${poke.name}Dialog${now}.close();});</script>`))
  htmx.unshift('<ul id="pokemon-results">')
  htmx.push('</ul>')

  const pokelist = JSON.stringify(htmx.join('')).replace(/\\"/g, '"').slice(
    1,
    -1,
  )

  return pokelist
}

/**
 * Get a pokemon an return an article.
 * @param {number} id - pokemon id
 * @returns {(html|false)} HTML fragment
 */
export const htmxPokemon = async (id) => {
  const poke = await getPokemon(id)
  if (poke) {
    const htmx =
      await `<article><h1><a href="/pokemon/${poke.id}">${poke.name}</a></h1><img src="${poke.sprite}" alt="${poke.name}"/><table><tr><th>weight</th><td>${poke.weight}</td></tr><tr><th>height</th><td>${poke.height}</td></tr><tr><th>type</th><td>${poke.types}</td></tr></table></article>`

    return htmx
  }
  return false
}
