import {
  getPokemon,
  htmlGetPokemon,
  htmlNotFound,
  listPokemon,
} from './pokemon.js'

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
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔴</text></svg>" />
  </head>
  <body>
    <header>
      <h1><a href="/web">Pokemon<a></h1>
    </header>
    ${body}
  </body>
</html>`

  return html
}

export async function htmlPageMain(query = false) {
  const pokemon = query ? await listPokemon(query) : await listPokemon()
  const now = Date.now()

  const pokeList = pokemon.map(
    (
      poke,
    ) =>
      `<li id="pokemon-${poke.id}"><a href="/web/pokemon/${poke.id}" ><figure><img src="${poke.sprite}" alt="${poke.name}" /><figcaption>${poke.name}</figcaption></figure></a>`,
  )
  pokeList.unshift('<ul id="pokemon-results">')
  pokeList.push('</ul>')

  const pokeUL = JSON.stringify(pokeList.join('')).replace(/\\"/g, '"').slice(
    1,
    -1,
  )

  const form = `<form method="GET" action="/web">
<input type="search" id="q" name="q" value="${query}">
<button>Search</button>
</form>`
  const html = form + pokeUL

  return htmlTemplate('Pokemon', html)
}
export async function htmlPokemon(id = false) {
  const pokemonReturn = id ? await getPokemon(id) : null
  const { code, pokemon } = pokemonReturn

  if (code === 200) {
    const title = pokemon.name
    const htmlReturn = await htmlGetPokemon(id)
    const { html: article } = htmlReturn
    const body = article
    console.log(body)

    return await htmlTemplate(title, body)
  }

  return
}
