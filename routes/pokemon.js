import {
  getPokemonCtrl,
  hxGetPokemonCtrl,
  hxListPokemonCtrl,
  listPokemonCtrl,
} from '../controllers/pokemon.js'

export const apiGetPokemonRtr = {
  GET: {
    route: '/api/pokemon/:id',
    handler: getPokemonCtrl,
  },
}

export const apiListPokemonRtr = {
  GET: {
    route: '/api/pokemon',
    handler: listPokemonCtrl,
  },
}

export const hxListPokemonRtr = {
  GET: {
    route: '/hx/pokemon',
    handler: hxListPokemonCtrl,
  },
}

export const hxGetPokemonRtr = {
  GET: {
    route: '/hx/pokemon/:id',
    handler: hxGetPokemonCtrl,
  },
}
