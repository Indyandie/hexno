import {
  deletePokemonCtrl,
  getPokemonCtrl,
  hxGetPokemonCtrl,
  hxListPokemonCtrl,
  listPokemonCtrl,
  webNewPokemonCtrl,
  webDeletePokemonCtrl,
} from '../controllers/pokemon.js'

export const apiGetPokemonRtr = {
  GET: {
    route: '/api/pokemon/:id',
    handler: getPokemonCtrl,
  },
  DELETE: {
    route: '/api/pokemon/:id',
    handler: deletePokemonCtrl,
  },
}

export const apiPokemonRtr = {
  GET: {
    route: '/api/pokemon',
    handler: listPokemonCtrl,
  },
}

export const webNewPokemonRtr = {
  POST: {
    route: '/pokemon/new',
    handler: webNewPokemonCtrl,
  },
}

export const webDeleletePokemonRtr = {
  POST: {
    route: '/pokemon/delete/:id',
    handler: webDeletePokemonCtrl,
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
