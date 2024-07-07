import {
  deletePokemonCtrl,
  getPokemonCtrl,
  createPokemonCtrl,
  hxGetPokemonCtrl,
  hxListPokemonCtrl,
  listPokemonCtrl,
  webDeletePokemonCtrl,
  webNewPokemonCtrl,
} from '../controllers/pokemon.js'

// API

export const apiGetPokemonRtr = {
  GET: {
    route: '/api/pokemon/:id',
    handler: getPokemonCtrl,
  },
  DELETE: {
    route: '/api/pokemon/:id',
    handler: deletePokemonCtrl,
  },
  PUT: {
    route: '/api/pokemon',
    handler: createPokemonCtrl,
  },
}

export const apiPokemonRtr = {
  GET: {
    route: '/api/pokemon',
    handler: listPokemonCtrl,
  },
}

// web

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

// htmx

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
