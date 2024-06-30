import { listPokemon, getPokemonById, htmxAllPokemonCtrl, htmxPokemonCtrl } from '../controllers/pokemon.js'

export const pokemon = {
  GET: {
    route: '/api/pokemon/:id',
    handler: getPokemonById
  }
}

export const pokemonList = {
  GET: {
    route: '/api/pokemon',
    handler: listPokemon
  }
}

export const pokeHTMX = {
  GET: {
    route: '/hx/pokemon',
    handler: htmxAllPokemonCtrl
  }
}

export const htmxPokeRouter = {
  GET: {
    route: '/hx/pokemon/:id',
    handler: htmxPokemonCtrl
  }
}

