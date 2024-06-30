import { csvParse } from '../deps.js'

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

export const getPokemon = async (id) => {
  let pokemon = await getAllPokemon()
  pokemon = pokemon[id - 1]

  if (pokemon) {
    return pokemon
  }

  return false
}

export const htmxAllPokemon = async (query) => {
  const pokemon = query ? await getAllPokemon(query) : await getAllPokemon()
  const now = Date.now()

  const htmx = pokemon.map((
    poke,
  ) => (`<li id="pokemon-${poke.id}"><button id="show-dialog-${poke.name}"><figure><img src="${poke.sprite}" alt="${poke.name}" /><figcaption>${poke.name}</figcaption></figure></button><dialog id="${poke.name}Dialog${now}"><article hx-get="/pokemon-htmx/${poke.id}" hx-trigger="intersect"></article><button autofocus>Close</button></dialog><script>const ${poke.name}Dialog${now} = document.querySelector("#${poke.name}Dialog${now}");const ${poke.name}${now}ShowButton = document.querySelector("#show-dialog-${poke.name}");const ${poke.name}${now}CloseButton = document.querySelector("#${poke.name}Dialog${now} button");${poke.name}${now}ShowButton.addEventListener("click", () => {${poke.name}Dialog${now}.showModal();});${poke.name}${now}CloseButton.addEventListener("click", () => {${poke.name}Dialog${now}.close();});</script>`))
  htmx.unshift('<ul id="pokemon-results">')
  htmx.push('</ul>')

  const pokelist = JSON.stringify(htmx.join('')).replace(/\\"/g, '"').slice(
    1,
    -1,
  )

  return pokelist
}

export const htmxPokemon = async (id) => {
  const poke = await getPokemon(id)
  if (poke) {
    const htmx =
      await `<article><h2>${poke.name}</h2><img src="${poke.sprite}" alt="${poke.name}"/><table><tr><th>weight</th><td>${poke.weight}</td></tr><tr><th>height</th><td>${poke.height}</td></tr><tr><th>type</th><td>${poke.types}</td></tr></table></article>`

    return htmx
  }
  return false
}
