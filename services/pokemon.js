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

export const KANTO_POKEDEX_OG = 151

/**
 * Read the data from `./models/pokemon.csv`, converts it into an object, and returns it. If a `query` is passed the object is filter by the pokemon name.
 * @param {string} [query] - filter pokemon by name
 * @param {number} [limit] - total number of pokemon to return
 * @param {number} [offset] - total number of pokemon to return
 * @returns {Pokemon[]} array of pokemon: id, name, weight, height, types, sprite, cries
 */
export const listPokemon = async (
  query = false,
  limit = KANTO_POKEDEX_OG,
  offset = 0,
) => {
  offset = offset ? parseInt(offset) : 0

  let pokemon = csvParse(await Deno.readTextFile('./models/pokemon.csv'), {
    skipFirstRow: true,
    strip: true,
  })

  if (limit === true) {
    limit = pokemon.length
  } else {
    limit = parseInt(limit)
    limit = limit > 0 ? limit : KANTO_POKEDEX_OG
  }

  pokemon = pokemon.map((poke) => {
    poke.id = parseInt(poke.id)
    poke.weight = parseInt(poke.weight)
    poke.height = parseInt(poke.height)
    poke.official = poke.official === 'true' ? true : false
    return poke
  })

  if (query) {
    const regex = new RegExp(query)

    pokemon = pokemon.filter((poke) => {
      return poke.name.match(regex)
    })
  }

  if (offset === false) {
    offset = 0
  } else {
    if (offset > 0) {
      if (offset > pokemon.length) {
        offset = pokemon.length - 1
        limit = pokemon.length
      } else {
        limit = offset + limit
      }
    }
  }

  pokemon = pokemon.slice(offset, limit)

  return pokemon
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

  const pokemonList = await listPokemon(false, true)
  id = parseInt(id)
  const pokemon = pokemonList.find((poke) => poke.id === id)

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

  const pokelist = await listPokemon(false, true)
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

  let pokelist = await listPokemon(false, true)
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

  const pokemonIndex = pokelist.findIndex((poke) =>
    parseInt(poke.id) === parseInt(checkPokemon.id)
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
  const { pokemon: checkPokemon } = await getPokemon(id)

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
    let pokemons = await listPokemon(false, true)

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
      <form method="POST" action="/web/delete-pokemon/${id}" >
        <button type="sumbit">delete</button>
      </form>
      <a href="/web/edit-pokemon/${id}">
        <button>edit</button>
      </a>
      `
      : ''

    const criesTr = cries
      ? `<tr><th>cries</th><td><audio controls controlslist="nodownload"><source src="${cries}" type="audio/ogg"></source><p>audio is not supported</p></audio></td></tr>`
      : ''

    const html =
      `<article><h1>${name}</h1><img src="${sprite}" alt="${name}" /><table><tr><th>weight</th><td>${weight}</td></tr><tr><th>height</th><td>${height}</td></tr><tr><th>type</th><td>${types}</td></tr>${criesTr}</table>${deleteForm}</article>`
    // `<article><h1><a href="/pokemon/${id}">${name}</a></h1><img src="${sprite}" alt="${name}" /><table><tr><th>weight</th><td>${weight}</td></tr><tr><th>height</th><td>${height}</td></tr><tr><th>type</th><td>${types}</td></tr>${criesTr}</table>${deleteForm}</article>`

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
