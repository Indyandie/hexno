import {
  createPokemonCtrl,
  deletePokemonCtrl,
  getPokemonCtrl,
  hxGetPokemonCtrl,
  hxListPokemonCtrl,
  listPokemonCtrl,
  updatePokemonCtrl,
  webDeletePokemonCtrl,
  webEditPokemonCtrl,
  webNewPokemonCtrl,
} from '../controllers/pokemon.js'
import { updatePokemon } from "../services/pokemon.js";

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

export const webNewPokemonRtr = {
  POST: {
    route: '/pokemon/new',
    handler: webNewPokemonCtrl,
  },
}

export const webEditPokemonRtr = {
  GET: {
    route: '/pokemon/edit/:id',
    handler: webEditPokemonCtrl,
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
