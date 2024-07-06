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
 * @param {number} id - pokemon id
 * @returns {(Pokemon|false)}
 */
export const getPokemon = async (id) => {
  let pokemon = await listPokemon()
  pokemon = pokemon.find((poke) => poke.id === id)

  if (pokemon) {
    return pokemon
  }

  return false
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
 * @param {NewPokemon} pokemon - New pokemon
 * @returns {boolean} success (`true`), fail (false)
 */
export async function createPokemon(pokemon) {
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

  pokemon.name = pokemon.name.replace(/\s+/g, '_')
  pokemon.weight = parseInt(pokemon.weight)
  pokemon.height = parseInt(pokemon.height)

  if (!pokemon.name.match(/^[a-zA-Z](\w|\d|\s)+$/)) {
    return {
      code: 422,
      prop: 'name',
      message:
        `Invalid (${pokemon.name}). Must be an alphanumerical string that start with a letter. Regex: <code>/^\w(\w\d\s)+$/</code>`,
    }
  }

  const pokelist = await listPokemon()

  const duplicates = pokelist.some(
    (poke) => poke.name === pokemon.name,
  )

  if (duplicates) {
    return {
      code: 409,
      prop: 'name',
      message: `duplicate: ${pokemon.name} already exist`,
    }
  }

  for (const prop in protomon) {
    const protoType = typeof protomon[prop]
    const pokeType = typeof pokemon[prop]

    if (protoType === 'number') {
      const pokeInt = pokemon[prop]
      if (isNaN(pokeInt)) {
        return {
          code: 400,
          prop: prop,
          message: `${prop} is not a number`,
        }
      }
      if (pokeInt < 1) {
        return {
          code: 400,
          prop: prop,
          message: `${prop} must be greater than 1`,
        }
      }
    }

    if (protoType !== pokeType) {
      return {
        code: 400,
        prop: prop,
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
      message: `Invalid URL, ${pokemon.sprite}`,
    }
  }

  pokemon.id = pokelist.length + 1000
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

  return {
    code: 201,
    id: pokemon.id,
    pokemon: await getPokemon(pokemon.id),
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
  let checkPokemon = await getPokemon(pokemon.id)

  if (checkPokemon.official) {
    return {
      code: 403,
      prop: 'name',
      message: `forbidden: cannot modify offical pokemon (${pokemon.name})`,
    }
  }

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

  pokemon.name = pokemon.name.replace(/\s+/g, '_')

  if (!pokemon.name.match(/^[a-zA-Z](\w|\d|\s)+$/)) {
    return {
      code: 422,
      prop: 'name',
      message:
        `Invalid (${pokemon.name}). Must be an alphanumerical string that start with a letter. Regex: <code>/^\w(\w\d\s)+$/</code>`,
    }
  }

  const pokelist = await listPokemon()

  const duplicates = pokelist.some((poke) => {
    return poke.name === pokemon.name && poke.id !== pokemon.id
  })

  if (duplicates) {
    return {
      code: 409,
      prop: 'name',
      message: `duplicate: ${pokemon.name} already exist`,
    }
  }

  for (const prop in protomon) {
    const protoType = typeof protomon[prop]
    let pokeType

    if (protoType === 'number') {
      const pokeInt = pokemon[prop]
      const testInt = parseInt(pokeInt)
      if (testInt != pokeInt) {
        return {
          code: 400,
          prop: prop,
          message: `${prop} is not a number`,
        }
      }
      pokeType = typeof parseInt(pokemon[prop])
    } else {
      pokeType = typeof pokemon[prop]
    }

    if (protoType !== pokeType) {
      return {
        code: 400,
        prop: prop,
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
      message: `Invalid URL, ${pokemon.sprite}`,
    }
  }

  checkPokemon.name = pokemon.name
  checkPokemon.weight = pokemon.weight
  checkPokemon.height = pokemon.height
  checkPokemon.types = pokemon.types
  checkPokemon.sprite = pokemon.sprite
  console.log(checkPokemon)
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

  return {
    code: 201,
    id: pokemon.id,
    pokemon: await getPokemon(pokemon.id),
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
      message: 'Pokemon does not exist',
    }
  } else if (checkPokemon.official) {
    console.log(checkPokemon)
    return {
      code: 403,
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
  const poke = await getPokemon(id)

  if (poke) {
    const { id, name, cries, weight, height, types, sprite, official } = poke
    const deleteForm = !official
      ? `<form method="POST" action="/pokemon/delete/${id}" >
        <button type="sumbit">delete</button>
      </form>`
      : ''

    const criesTr = cries
      ? `<tr><th>cries</th><td><audio controls controlslist="nodownload"><source src="${cries}" type="audio/ogg"></source><p>audio is not supported</p></audio></td></tr>`
      : ''

    return await `<article><h1><a href="/pokemon/${id}">${name}</a></h1><img src="${sprite}" alt="${name}" /><table><tr><th>weight</th><td>${weight}</td></tr><tr><th>height</th><td>${height}</td></tr><tr><th>type</th><td>${types}</td></tr>${criesTr}</table>${deleteForm}</article>`
  }
  return false
}
