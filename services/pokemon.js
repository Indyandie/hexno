import { csvParse, csvStringify } from '../deps.js'

export const getAllPokemon = async () => {
  return csvParse(await Deno.readTextFile('./models/pokemon.csv'), {
    skipFirstRow: true,
    strip: true,
  })
}

export const getPokemon = async (id) => {
  const pokemon = await getAllPokemon()
  return pokemon[id - 1]
}

export const htmxAllPokemon = async () => {
  const pokemon = await getAllPokemon()
  const htmx = pokemon.map((poke) => (`<li id="pokemon-${poke.id}"><header>${poke.name}</header><img src="${poke.sprite}" alt="${poke.name}"  /><p><ul><li>weight: ${poke.weight}</li><li>height: ${poke.height}</li><li>types: ${poke.types}</li></ul></p></li>`))
  htmx.unshift('<ul>')
  htmx.push('<ul>')

  const pokelist = JSON.stringify(htmx.join('')).replace(/\\"/g, '"').slice(1, -1)
  return pokelist
}

export const htmxPokemon = async (id) => {
  const pokemon = await getPokemon(id)
  const htmx = await `<article><h2>${pokemon.name}</h2><img src="${pokemon.sprite}" alt="${pokemon.name}"/><table><tr><th>weight</th><td>${pokemon.weight}</td></tr><tr><th>height</th><td>${pokemon.height}</td></tr><tr><th>type</th><td>${pokemon.type}</td></tr></table></article>`

  return htmx
}

