import { csvParse, csvStringify } from '../deps.js'

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
 * @property {string} sprite - image URL
 * @property {string} cries - audio URL
 */

/**
 * Read the data from `./models/pokemon.csv`, converts it into an object, and returns it. If a `query` is passed the object is filter by the pokemon name.
 * @param {string} [query] - filter pokemon by name
 * @returns {Pokemon[]} array of pokemon: id, name, weight, height, types, sprite, cries
 */
export const listPokemon = async (query) => {
  let pokemon = csvParse(await Deno.readTextFile('./models/pokemon.csv'), {
    skipFirstRow: true,
    strip: true,
  })

  pokemon = pokemon.map((poke) => {
    poke.id = parseInt(poke.id)
    poke.weight = parseInt(poke.weight)
    poke.height = parseInt(poke.height)
    poke.official = poke.official === 'true' ? true : false
    return poke
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
 * @param {number} id - pokemon ID
 * @returns {(Pokemon|false)}
 */
export const getPokemon = async (id) => {
  const trailingChar = id.toString().match(/[^\d]/g)
  const pokeInt = parseInt(id)

  // isNaN is not really doing anything here but keeping it around for reference
  if (isNaN(pokeInt) || trailingChar !== null) {
    return {
      code: 400,
      error: 'Invalid Type',
      message: `Pokemon id must be an interger ${id}`,
    }
  }

  let pokemon = await listPokemon()
  id = parseInt(id)
  pokemon = pokemon.find((poke) => poke.id === id)

  if (pokemon) {
    return {
      code: 200,
      pokemon,
    }
  }

  return {
    code: 404,
    error: 'Not Found',
    message: `${id} is not a pokemon ID`,
  }
}

/**
 * @typedef {Object} NewPokemon
 * @property {string} name
 * @property {number} weight
 * @property {number} height
 * @property {string} types
 * @property {string} sprite - URL
 */

/**
 * Validate pokemon data.
 * @param {NewPokemon} pokemon - New pokemon
 * @param {boolean} checkDuplicate - Check if new pokemon is duplicate.
 * @returns {Object}
 */
async function validatePokemon(pokemon, checkDuplicate = true) {
  /**
   * Pokemon object to validate new pokemon.
   * @type {NewPokemon}
   */
  const protomon = {
    name: 'string',
    weight: 1,
    height: 1,
    types: 'string',
    sprite: 'url',
  }

  const pokelist = await listPokemon()
  pokemon.name = pokemon.name.replace(/\s+/g, '_')

  if (!checkDuplicate) {
    const duplicates = pokelist.some(
      (poke) => poke.name === pokemon.name && poke.id !== parseInt(pokemon.id),
    )

    if (duplicates) {
      return {
        code: 409,
        prop: 'name',
        error: 'Duplicate Name',
        message: `${pokemon.name} is already in use`,
      }
    }
  } else {
    const duplicates = pokelist.some(
      (poke) => poke.name === pokemon.name && poke.id !== pokemon.id,
    )
    if (duplicates) {
      return {
        code: 409,
        prop: 'name',
        error: 'Duplicate Pokemon',
        message: `${pokemon.name} already exist`,
      }
    }
  }

  if (!pokemon.name.match(/^[a-zA-Z](\w|\d|\s)+$/)) {
    return {
      code: 422,
      prop: 'name',
      error: 'Invalid Name Syntax',
      message:
        `Invalid (${pokemon.name}). Must be an alphanumerical string that start with a letter. Regex: <code>/^\w(\w\d\s)+$/</code>`,
    }
  }

  for (const prop in protomon) {
    const protoType = typeof protomon[prop]

    if (protoType === 'number') {
      const trailingChar = pokemon[prop].toString().match(/[^\d]/g)

      const pokeInt = parseInt(pokemon[prop])

      // isNaN is not really doing anything here but keeping it around for reference
      if (isNaN(pokeInt) || trailingChar !== null) {
        return {
          code: 400,
          prop: prop,
          error: 'Invalid Number',
          message: `${prop} is not a number`,
        }
      }

      pokemon[prop] = pokeInt

      if (pokeInt < 1) {
        return {
          code: 400,
          prop: prop,
          error: 'Invalid Number Value',
          message: `${prop} must be greater than 1`,
        }
      }
    }

    const pokeType = typeof pokemon[prop]

    if (protoType !== pokeType) {
      return {
        code: 400,
        prop: prop,
        error: 'Invalid Type',
        message: `${prop}: expected ${protoType}, received ${pokeType}`,
      }
    }
  }

  try {
    new URL(pokemon.sprite)
  } catch {
    return {
      code: 422,
      prop: 'sprite',
      error: 'Invalid URL',
      message: `Malformed URL, ${pokemon.sprite}`,
    }
  }

  return {
    isValid: true,
    pokemon,
    pokelist,
  }
}

/**
 * Validate Pokemon data and save it to `./models/pokemon.csv`.
 * @param {NewPokemon} pokemon - New pokemon
 * @returns {boolean} success (`true`), fail (false)
 */
export async function createPokemon(pokemon) {
  let pokelist
  const valid = await validatePokemon(pokemon)

  if (valid.isValid) {
    pokemon = valid.pokemon
    pokelist = valid.pokelist
  } else {
    return valid
  }

  const largestId = pokelist[pokelist.length - 1].id
  if (largestId < 500) {
    pokemon.id = largestId + 1000
  } else {
    pokemon.id = largestId + 1
  }

  pokemon.official = false
  pokemon.cries = null
  const poketest = [...pokelist, pokemon]
  const csvpoketest = csvStringify(poketest, {
    columns: [
      'id',
      'name',
      'weight',
      'height',
      'types',
      'sprite',
      'cries',
      'official',
    ],
  })

  await Deno.writeTextFile('./models/pokemon.csv', csvpoketest)

  const newPokemonReturn = await getPokemon(pokemon.id)
  const { pokemon: newPokemon } = newPokemonReturn


  return {
    code: 201,
    id: pokemon.id,
    pokemon: newPokemon,
  }
}

/**
 * @typedef {Object} NewPokemon
 * @property {string} name
 * @property {number} weight
 * @property {number} height
 * @property {string} types
 * @property {string} sprite - URL
 * @property {string} cries - URL
 */

/**
 * Validate Pokemon data and save it to `./models/pokemon.csv`.
 * @param {Pokemon} pokemon - Edit pokemon info
 * @returns {Object} code, prop, message, pokemon
 */
export async function updatePokemon(pokemon) {
  const getCheckPokemon = await getPokemon(pokemon.id)
  const { code: checkCode, pokemon: checkPokemon } = getCheckPokemon

  if (checkCode !== 200) {
    return getCheckPokemon
  }

  if (!checkPokemon) {
    return {
      code: 404,
      error: 'Pokemon Not Found',
      message: `Pokemon does not exist.`,
    }
  }

  if (checkPokemon.official) {
    return {
      code: 403,
      error: 'Forbidden',
      message: `Cannot modify offical pokemon (${checkPokemon.name})`,
    }
  }

  const {
    name: currname,
    weight: currweight,
    height: currheight,
    types: currtypes,
    sprite: currsprite,
  } = checkPokemon

  const {
    name: newname,
    weight: newweight,
    height: newheight,
    types: newtypes,
    sprite: newsprite,
  } = pokemon

  const newPoke = 'a' + newname + newweight + newheight + newtypes +
    newsprite
  const currPoke = 'a' + currname + currweight + currheight + currtypes +
    currsprite

  if (newPoke === currPoke) {
    return {
      code: 422,
      prop: 'name',
      error: 'Nothing To Do',
      message: `No new changes detected`,
    }
  }

  let pokelist
  const valid = await validatePokemon(pokemon, false)

  if (valid.isValid) {
    pokemon = valid.pokemon
    pokelist = valid.pokelist
  } else {
    return valid
  }

  checkPokemon.name = pokemon.name
  checkPokemon.weight = pokemon.weight
  checkPokemon.height = pokemon.height
  checkPokemon.types = pokemon.types
  checkPokemon.sprite = pokemon.sprite

  const pokemonIndex = pokelist.findLastIndex((poke) =>
    poke.id === checkPokemon.id
  )
  pokelist[pokemonIndex] = checkPokemon
  const csvpoketest = csvStringify(pokelist, {
    columns: [
      'id',
      'name',
      'weight',
      'height',
      'types',
      'sprite',
      'cries',
      'official',
    ],
  })

  await Deno.writeTextFile('./models/pokemon.csv', csvpoketest)

  const { pokemon: updatedPokemon } = await getPokemon(pokemon.id)

  return {
    code: 200,
    id: pokemon.id,
    pokemon: updatedPokemon,
  }
}

/**
 * Delete a pokemon by `id`.
 * @param {number} id - pokemon id
 * @returns {Object} code, message, pokemon|false
 */
export const deletePokemon = async (id) => {
  const checkPokemon = await getPokemon(id)

  if (!checkPokemon) {
    return {
      code: 404,
      error: 'Pokemon Not Found',
      message: 'Pokemon does not exist',
    }
  } else if (checkPokemon.official) {
    return {
      code: 403,
      error: 'Forbidden',
      message: 'Cannot delete official pokemon',
      pokemon: checkPokemon,
    }
  } else {
    let pokemons = await listPokemon()

    pokemons = pokemons.filter((poke) => {
      if (poke.id !== id) {
        return true
      } else if (poke.official) {
        return true
      }
      return false
    })

    const csvpoketest = csvStringify(pokemons, {
      columns: [
        'id',
        'name',
        'weight',
        'height',
        'types',
        'sprite',
        'cries',
        'official',
      ],
    })

    await Deno.writeTextFile('./models/pokemon.csv', csvpoketest)

    return {
      code: 200,
      message: 'Pokemon deleted',
      pokemon: checkPokemon,
    }
  }
}

// HTML

/**
 * Get all pokemon an return an unorder list with embedded dialogs.
 * @param {string} [query] - filter pokemon by name
 * @returns {(html|false)} HTML fragment
 */
export const htmlListPokemon = async (query) => {
  // lsp keeps telling me await has no effect but when I remove it things break...
  const pokemon = query ? await listPokemon(query) : await listPokemon()
  const now = Date.now()

  const html = pokemon.map(
    (
      poke,
    ) =>
      `<li id="pokemon-${poke.id}"><button id="show-dialog-${poke.name}"><figure><img src="${poke.sprite}" alt="${poke.name}" /><figcaption>${poke.name}</figcaption></figure></button><dialog id="${poke.name}Dialog${now}"><article hx-get="/hx/pokemon/${poke.id}" hx-trigger="intersect"></article><button autofocus>Close</button></dialog><script>const ${poke.name}Dialog${now} = document.querySelector("#${poke.name}Dialog${now}");const ${poke.name}${now}ShowButton = document.querySelector("#show-dialog-${poke.name}");const ${poke.name}${now}CloseButton = document.querySelector("#${poke.name}Dialog${now} button");${poke.name}${now}ShowButton.addEventListener("click", () => {${poke.name}Dialog${now}.showModal();});${poke.name}${now}CloseButton.addEventListener("click", () => {${poke.name}Dialog${now}.close();});</script>`,
  )
  html.unshift('<ul id="pokemon-results">')
  html.push('</ul>')

  const pokelist = JSON.stringify(html.join('')).replace(/\\"/g, '"').slice(
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
export const htmlGetPokemon = async (id) => {
  const { code, pokemon: poke } = await getPokemon(id)

  if (code === 200) {
    const { id, name, cries, weight, height, types, sprite, official } = poke
    const deleteForm = !official
      ? `
      <form method="POST" action="/pokemon/delete/${id}" >
        <button type="sumbit">delete</button>
      </form>
      <a href="/pokemon/edit/${id}">
        <button>edit</button>
      </a>
      `
      : ''

    const criesTr = cries
      ? `<tr><th>cries</th><td><audio controls controlslist="nodownload"><source src="${cries}" type="audio/ogg"></source><p>audio is not supported</p></audio></td></tr>`
      : ''

    const html =
      `<article><h1><a href="/pokemon/${id}">${name}</a></h1><img src="${sprite}" alt="${name}" /><table><tr><th>weight</th><td>${weight}</td></tr><tr><th>height</th><td>${height}</td></tr><tr><th>type</th><td>${types}</td></tr>${criesTr}</table>${deleteForm}</article>`

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

export const htmlForbidden = (response, delay = 0, redirect = false) => {
  return `<!doctype html>
<html lang="en" dir="auto">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    ${
    !redirect
      ? ''
      : '<meta http-equiv="Refresh" content="' + delay + ", url='" + redirect +
        '\'" >'
  }
    <title>Forbidden</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔴</text></svg>" />
    <script src="/public/js/htmx.min.js"></script>
  </head>
  <body>
    <main>
      <section>
        <h1>Forbidden</h1>
        <code>${response}</code>
      </section>
    </main>
  </body>
</html>`
}

export const htmlNotFound = (response = false, delay = 0, redirect = false) => {
  return `<!doctype html>
<html lang="en" dir="auto">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    ${
    !redirect
      ? ''
      : '<meta http-equiv="Refresh" content="' + delay + ", url='" + redirect +
        '\'" >'
  }
    <title>Not Found</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔴</text></svg>" />
    <script src="/public/js/htmx.min.js"></script>
  </head>
  <body>
    <main>
      <section>
        <h1>Not found</h1>
        <p>These are not the pokemon you are looking</p>
        ${!response ? '' : '<code>' + response + '</code>'}
        <a href='/'>Main page</a>
      </section>
    </main>
  </body>
</html>`
}

const htmlEditForm = (pokemon, prop = false, message = false) => {
  return `<!doctype html>
<html lang="en" dir="auto">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Edit ${pokemon.id}</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔴</text></svg>" />
    <script src="/public/js/htmx.min.js"></script>
  </head>
  <body>
    <main>
      <section class="pokelistmon">
        <h1>Edit ${pokemon.id}</h1>
        <img src="${pokemon.sprite}" alt="${pokemon.name}" />
        <form action="/pokemon/edit/${pokemon.id}" method="POST">
          <div>
            <label for="name">name</label>
            <span>${prop && 'name' === prop ? message : ''}</span>
            <br />
            <input type="text" name="name" value="${pokemon.name}" required />
          </div>
          <div>
            <label for="weight">weight</label>
            <span>${prop && 'weight' === prop ? message : ''}</span>
            <br />
            <input type="number" name="weight" min="1" value="${pokemon.weight}" required />
          </div>
          <div>
            <label for="height">height</label>
            <span>${prop && 'height' === prop ? message : ''}</span>
            <br />
            <input type="number" name="height" min="1" value="${pokemon.height}" required />
          </div>
          <div>
            <label for="types">types</label>
            <span>${prop && 'types' === prop ? message : ''}</span>
            <br />
            <input type="text" name="types" list="pokemonmon-types" value="${pokemon.types}" required />
            <datalist id="pokemonmon-types">
              <option value="normal"></option>
              <option value="grass"></option>
              <option value="water"></option>
              <option value="fire"></option>
              <option value="rock"></option>
            </datalist>
          </div>
          <div>
            <label for="sprite">sprite</label>
            <span>${prop && 'sprite' === prop ? message : ''}</span>
            <br />
            <input type="url" name="sprite" value="${pokemon.sprite}" required />
          </div>
          <button type="submit">Update</button>
        </form>
      </section>
    </main>
  </body>
</html>`
}

const htmlUpdatedPokemon = (pokemon) => {
  return `<!doctype html>
<html lang="en" dir="auto">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Refresh" content="0, url='/pokemon/${pokemon.id}'" >
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Updated: ${pokemon.name} [${pokemon.id}]</title>
    <link
      rel="icon"
      href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔴</text></svg>"
    />
    <script src="/public/js/htmx.min.js"></script>
  </head>

  <body>
    <main>
      <h1>Updated!</h1>
      <code>
        ${JSON.stringify(pokemon, null, '<br>')}
      </code>
    </main>
  </body>
</html>`
}

/**
 * Edit a pokemon form.
 * @param {number} pokemonId - pokemon id
 * @param {Object|null} [pokemonObj] - pokemon object
 * @returns {(html|false)} HTML fragment
 */
export const htmlEditPokemon = async (pokemonId, pokemonObj = null) => {
  let html

  if (pokemonObj === null) {
    const pokeReturn = await getPokemon(pokemonId)
    const { code, pokemon, error, message } = pokeReturn
    console.log('get poke_return', pokeReturn)

    if (!pokemon) {
      return { code: 404, html: htmlNotFound() }
    }

    if (pokemon.official) {
      const officialForbidden = `<b>${pokemon.name}</b> cannot be edited`
      const redirectUrl = `/pokemon/${pokemon.id}`
      return {
        code: 403,
        html: htmlForbidden(
          officialForbidden,
          0,
          redirectUrl,
        ),
      }
    }

    if (code === 200) {
      return {
        code,
        html: await htmlEditForm(pokemon),
      }
    }
  } else {
    const pokeReturn = await updatePokemon(pokemonObj)
    const { code, pokemon, prop, error, message } = pokeReturn
    console.log('update poke return', pokeReturn)

    if (code === 403) {
      const officialForbidden = !pokemon
        ? message
        : `<b>${pokemon.name}</b> cannot be edited`
      const redirectUrl = `/pokemon/${pokemonId}`

      return {
        code,
        html: htmlForbidden(
          officialForbidden,
          0,
          redirectUrl,
        ),
      }
    }

    if (code === 404) {
      return {
        code,
        html: htmlNotFound(message),
      }
    }

    if (code === 200) {
      return {
        code,
        html: htmlUpdatedPokemon(pokemon),
      }
    }

    return {
      code,
      html: await htmlEditForm(pokemonObj, prop, message),
    }
  }
}
