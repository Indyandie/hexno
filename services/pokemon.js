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

export const htmxPokemon = async () => {
  const pokemon = await getAllPokemon()
  const htmx = pokemon.map((poke) => {
    return `<li id="pokemon-${poke.order}"><header>${poke.name}</header><img src="${poke.sprite} alt="${poke.name}"  /><p><ul><li>weight: ${poke.weight}</li><li>height: ${poke.height}</li><li>types: ${poke.types}</li></ul></p></li>`
  })
  htmx.unshift('<ul>')
  htmx.push('<ul>')
  const pokelist = JSON.stringify(htmx.join(''))
  // return "<ol>" + pokelist
  return pokelist.replace(/\\"/g, '"').slice(1, -1)
}


