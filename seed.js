import { csvParse, csvStringify } from './deps.js'

async function fetchPokeData(url) {
  const resp = await fetch(url)
  const text = await resp.text()
  const data = JSON.parse(text)
  const pokeData = {
    id: data.id,
    name: data.name,
    weight: data.weight,
    height: data.height,
    types: data.types[0].type.name,
    sprite: data.sprites["front_default"],
    cries: data.cries.latest,
  }
  return pokeData
}

let pokelist = await fetch("https://pokeapi.co/api/v2/pokemon?limit=251&offset=0")
pokelist = await pokelist.text()
pokelist = JSON.parse(pokelist).results

let pokemap = await Promise.all(pokelist.map(poke => fetchPokeData(poke.url)))

let pokeCSV = csvStringify(pokemap, {
  columns: [
    'id',
    'name',
    'weight',
    'height',
    'types',
    'sprite',
  ]
})

await Deno.writeTextFile("./models/pokemon.csv", pokeCSV)

