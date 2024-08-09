import { Router } from './Router.js'
import {
  apiPokemonIdRtr,
  apiPokemonRtr,
  hxGetPokemonRtr,
  hxListPokemonRtr,
  webDeleletePokemonRtr,
  webEditPokemonRtr,
  webMainPokemonRtr,
  webNewPokemonRtr,
  webPokemonRtr,
} from './pokemon.js'
import { srvFl } from '../deps.js'

export const router = new Router()

// main?

const home = (req) => {
  return srvFl(req, './public/index.html')
}
router.get('/', home)

const poke = (req) => {
  return srvFl(req, './public/pokemon/index.html')
}
router.get('/pokemon/:id', poke)

// web

const webNewPokemon = (req) => {
  return srvFl(req, './public/web/new-pokemon.html')
}

router.get(webMainPokemonRtr.GET.route, webMainPokemonRtr.GET.handler)
router.get(webPokemonRtr.GET.route, webPokemonRtr.GET.handler)
router.get('/web/new-pokemon', webNewPokemon)
router.post(webNewPokemonRtr.POST.route, webNewPokemonRtr.POST.handler)
router.get(webEditPokemonRtr.GET.route, webEditPokemonRtr.GET.handler)
router.post(webEditPokemonRtr.POST.route, webEditPokemonRtr.POST.handler)
router.post(
  webDeleletePokemonRtr.POST.route,
  webDeleletePokemonRtr.POST.handler,
)

// API

router.put(apiPokemonRtr.PUT.route, apiPokemonRtr.PUT.handler)
router.get(apiPokemonRtr.GET.route, apiPokemonRtr.GET.handler)
router.get(apiPokemonIdRtr.GET.route, apiPokemonIdRtr.GET.handler)
router.patch(apiPokemonIdRtr.PATCH.route, apiPokemonIdRtr.PATCH.handler)
router.delete(apiPokemonIdRtr.DELETE.route, apiPokemonIdRtr.DELETE.handler)

// htmx

const hx = (req) => {
  return srvFl(req, './public/hx/index.html')
}
router.get('/hx', hx)

router.get(hxGetPokemonRtr.GET.route, hxGetPokemonRtr.GET.handler)
router.get(hxListPokemonRtr.GET.route, hxListPokemonRtr.GET.handler)
