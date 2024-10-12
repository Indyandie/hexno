import {
  createPokemonCtrl,
  deletePokemonCtrl,
  getPokemonCtrl,
  hxCreatePokemonCtrl,
  hxDeletePokemonCtrl,
  hxEditPokemonCtrl,
  hxGetPokemonCtrl,
  hxListPokemonCtrl,
  hxNewPokemonCtrl,
  hxPokedexCtrl,
  hxUpdatePokemonCtrl,
  listPokemonCtrl,
  notFoundCtrl,
  updatePokemonCtrl,
  webDeletePokemonCtrl,
  webEditPokemonCtrl,
  webHomePokemonCtrl,
  webNewPokemonCtrl,
  webPokemonCtrl,
  webUpdatePokemonCtrl,
} from '../controllers/pokemon.js'

// API

export const apiPokemonRtr = {
  GET: {
    route: '/api/pokemon',
    handler: listPokemonCtrl,
  },
  PUT: {
    route: '/api/pokemon',
    handler: createPokemonCtrl,
  },
}

export const apiPokemonIdRtr = {
  GET: {
    route: '/api/pokemon/:id',
    handler: getPokemonCtrl,
  },
  PATCH: {
    route: '/api/pokemon/:id',
    handler: updatePokemonCtrl,
  },
  DELETE: {
    route: '/api/pokemon/:id',
    handler: deletePokemonCtrl,
  },
}

// web

export const webMainPokemonRtr = {
  GET: {
    route: '/web',
    handler: webHomePokemonCtrl,
  },
}

export const webPokemonRtr = {
  GET: {
    route: '/web/pokemon/:id',
    handler: webPokemonCtrl,
  },
}

export const webNewPokemonRtr = {
  POST: {
    route: '/web/new-pokemon',
    handler: webNewPokemonCtrl,
  },
}

export const webEditPokemonRtr = {
  GET: {
    route: '/web/edit-pokemon/:id',
    handler: webEditPokemonCtrl,
  },
  POST: {
    route: '/web/edit-pokemon/:id',
    handler: webUpdatePokemonCtrl,
  },
}

export const webDeleletePokemonRtr = {
  POST: {
    route: '/web/delete-pokemon/:id',
    handler: webDeletePokemonCtrl,
  },
}

// htmx

export const hxListPokemonRtr = {
  GET: {
    route: '/hx/pokemon',
    handler: hxListPokemonCtrl,
  },
  PUT: {
    route: '/hx/pokemon',
    handler: hxCreatePokemonCtrl,
  },
}

export const hxPokemonRtr = {
  NEW: {
    route: '/hx/pokemon/new',
    handler: hxNewPokemonCtrl,
  },
  GET: {
    route: '/hx/pokemon/:id',
    handler: hxGetPokemonCtrl,
  },
  EDIT: {
    route: '/hx/pokemon/:id/edit',
    handler: hxEditPokemonCtrl,
  },
  PATCH: {
    route: '/hx/pokemon/:id',
    handler: hxUpdatePokemonCtrl,
  },
  DELETE: {
    route: '/hx/pokemon/:id',
    handler: hxDeletePokemonCtrl,
  },
}

export const hxPokedexRtr = {
  GET: {
    route: '/hx/pokedex/:id',
    handler: hxPokedexCtrl,
  },
}

export const notFoundRtr = {
  GET: {
    route: '*',
    handler: notFoundCtrl,
  },
}
