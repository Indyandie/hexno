import {
  getPokemon,
  htmlGetPokemon,
  htmlListPokemon,
  listPokemon,
} from '../services/pokemon.js'

const status404 = new Response(
  null,
  {
    status: 404,
    statusText: 'Not Found',
  },
)

export const listPokemonCtrl = async (req) => {
  const url = new URL(req.url)
  const query = url.searchParams.get('q')

  return new Response(
    JSON.stringify(await listPokemon(query)),
    {
      headers: {
        'content-type': 'text/json; charset=utf-8',
      },
    },
  )
}

export const getPokemonCtrl = async (req, match) => {
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

export const hxListPokemonCtrl = async (req) => {
  const url = new URL(req.url)
  const query = url.searchParams.get('q')

  return new Response(
    await htmlListPokemon(query),
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    },
  )
}

export const hxGetPokemonCtrl = async (req, match) => {
  const pokeId = match.pathname.groups.id
  const pokeRes = await htmlGetPokemon(pokeId)

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
