import { getAllPokemon, getPokemon, htmxAllPokemon, htmxPokemon } from '../services/pokemon.js'

export const listPokemon = async () => new Response(
  JSON.stringify(await getAllPokemon()),
  {
    headers: {
      'content-type': 'text/json; charset=utf-8'
    }
  }
)

export const getPokemonById = async (req, match) => {
  const pokeId = match.pathname.groups.id

  return new Response(
    JSON.stringify(await getPokemon(pokeId)),
    {
      headers: {
        'Content-Type': 'text/json; charset=utf-8'
      }
    }
  )
}

export const htmxAllPokemonCtrl = async () => new Response(
  await htmxAllPokemon(),
  {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  }

)

export const htmxPokemonCtrl = async (req, match) => {
  const pokeId = match.pathname.groups.id

  return new Response(
    await htmxPokemon(pokeId),
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    }

  )
}

