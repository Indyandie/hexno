import {
  getAllPokemon,
  getPokemon,
  htmxAllPokemon,
  htmxPokemon,
} from '../services/pokemon.js'

const status404 = new Response(
  null,
  {
    status: 404,
    statusText: 'Not Found',
  },
)

export const listPokemon = async (req) => {
  const url = new URL(req.url)
  const query = url.searchParams.get('q')

  return new Response(
    JSON.stringify(await getAllPokemon(query)),
    {
      headers: {
        'content-type': 'text/json; charset=utf-8',
      },
    },
  )
}

export const getPokemonById = async (req, match) => {
  const pokeId = match.pathname.groups.id
  const pokeRes = await getPokemon(pokeId)

  if (!pokeRes) {
    return status404
  }

  return new Response(
    JSON.stringify(pokeRes),
    {
      headers: {
        'Content-Type': 'text/json; charset=utf-8',
      },
    },
  )
}

export const htmxAllPokemonCtrl = async (req) => {
  const url = new URL(req.url)
  const query = url.searchParams.get('q')

  return new Response(
    await htmxAllPokemon(query),
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    },
  )
}

export const htmxPokemonCtrl = async (req, match) => {
  const pokeId = match.pathname.groups.id
  const pokeRes = await htmxPokemon(pokeId)

  if (!pokeRes) {
    return status404
  }

  return new Response(
    pokeRes,
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    },
  )
}
