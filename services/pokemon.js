import { csvParse, csvStringify } from '../deps.js'

export async function getPokemon() {
  return csvParse(await Deno.readTextFile('./models/pokemon.csv'), {
    skipFirstRow: true,
    strip: true,
  })
}

export const htmxPokemon = async () => {
  const pokemon = await getPokemon()
  const htmx = pokemon.map((poke) => {
    return `<li id="pokemon-${poke.order}">
  <header>${poke.name}</header>
  <p>
    <ol>
      <li>weight: ${poke.weight}<li>
      <li>height: ${poke.height}<li>
      <li>types: ${poke.types}<li>
    </ol>
  <p>
</li>`
  })
  return JSON.stringify(htmx.join("\n"))
}

