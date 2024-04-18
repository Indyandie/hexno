import { getAllPokemon, htmxAllPokemon } from '../services/pokemon.js'

export const listPokemon= async (req, params) => new Response(
  JSON.stringify(await getAllPokemon())
)

export const htmxPoke = async (req) => new Response( 
  await htmxAllPokemon(),
  { headers: {
          'Content-Type': 'text/html; charset=utf-8'
        }}

)
