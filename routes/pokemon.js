import { listPokemon, getPokemonById, htmxAllPokemonCtrl, htmxPokemonCtrl } from '../controllers/pokemon.js'

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
    handler: htmxAllPokemonCtrl
  }
}

export const htmxPokeRouter = {
  GET: {
    route: '/pokemon-htmx/:id',
    handler: htmxPokemonCtrl
  }
}

