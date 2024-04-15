import { listPokemon, htmxPoke } from '../controllers/pokemon.js'

export const pokemon = {
  GET: {
    route: '/pokemon',
    handler: listPokemon
  }
}

export const pokeHTMX = {
  GET: {
    route: '/pokemon/htmx',
    handler: htmxPoke
  }
}
