import { getPokemon, htmxPokemon } from '../services/pokemon.js'

// export const listPokemon= async (req ) => new Response( await getPokemon());await 

export const listPokemon= async (req, params) => new Response(
  JSON.stringify(await getPokemon())
)

export const htmxPoke = async (req) => new Response( 
  await htmxPokemon()
)
