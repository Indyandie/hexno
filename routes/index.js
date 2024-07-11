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

const home = (req) => {
  return srvFl(req, './public/index.html')
}
const poke = (req) => {
  return srvFl(req, './public/pokemon/index.html')
}
const newPoke = (req) => {
  return srvFl(req, './public/pokemon/new/index.html')
}

// main?

router.get('/', home)
router.get('/pokemon/new', newPoke) // must go before /pokemon/:id
router.get('/pokemon/:id', poke)

// web

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

router.get(hxGetPokemonRtr.GET.route, hxGetPokemonRtr.GET.handler)
router.get(hxListPokemonRtr.GET.route, hxListPokemonRtr.GET.handler)
