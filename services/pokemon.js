import { csvParse, csvStringify } from '../deps.js'

export const getAllPokemon = async () => {
  return csvParse(await Deno.readTextFile('./models/pokemon.csv'), {
    skipFirstRow: true,
    strip: true,
  })
}

export const getPokemon = async (id) => {
  let pokemon = await getAllPokemon()
  pokemon = pokemon[id - 1]

  if(pokemon) {
    return pokemon
  }
  
  return false
}

export const htmxAllPokemon = async () => {
  const pokemon = await getAllPokemon()
  const htmx = pokemon.map((poke) => (`<li id="pokemon-${poke.id} show-dialog-${poke.name}"><button class="show-dialog-${poke.name}"><figure><img src="${poke.sprite}" alt="${poke.name}" /><figcaption>${poke.name}</figcaption></figure></button><dialog class="${poke.name}"><article hx-get="/pokemon-htmx/${poke.id}" hx-trigger="intersect"></article><button autofocus>Close</button></dialog><script>const ${poke.name}Dialog = document.querySelector("dialog.${poke.name}"); const ${poke.name}ShowButton = document.querySelector("button.show-dialog-${poke.name}"); const ${poke.name}CloseButton = document.querySelector("dialog.${poke.name} button"); ${poke.name}ShowButton.addEventListener("click", () => {${poke.name}Dialog.showModal();}); ${poke.name}CloseButton.addEventListener("click", () => {${poke.name}Dialog.close();});</script></li>`))
  htmx.unshift('<ul>')
  htmx.push('<ul>')

  const pokelist = JSON.stringify(htmx.join('')).replace(/\\"/g, '"').slice(1, -1)
  return pokelist
}

export const htmxPokemon = async (id) => {
  const poke = await getPokemon(id)
  if (poke) {
    const htmx = await `<article><h2>${poke.name}</h2><img src="${poke.sprite}" alt="${poke.name}"/><table><tr><th>weight</th><td>${poke.weight}</td></tr><tr><th>height</th><td>${poke.height}</td></tr><tr><th>type</th><td>${poke.types}</td></tr></table></article>`

    return htmx
  }
  return false
}

