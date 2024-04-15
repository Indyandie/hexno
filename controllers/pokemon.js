import { getPokemon, htmxPokemon } from '../services/pokemon.js'

export const listPokemon= async (req, params) => new Response(
  JSON.stringify(await getPokemon())
)

export const htmxPoke = async (req) => new Response( 
  await htmxPokemon(),
  { headers: {
          'Content-Type': 'text/html; charset=utf-8'
        }}

)
