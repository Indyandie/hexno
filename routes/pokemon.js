import { listPokemon, getPokemonById, htmxPoke } from '../controllers/pokemon.js'

export const pokemon = {
  GET: {
    route: '/pokemon/:id',
    handler: getPokemonById
  }
}

export const pokemonList = {
  GET: {
    route: '/pokemon',
    handler: listPokemon
  }
}

export const pokeHTMX = {
  GET: {
    route: '/pokemon-htmx',
    handler: htmxPoke
  }
}
