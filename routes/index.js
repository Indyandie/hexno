import { Router } from './Router.js'
import {
  apiGetPokemonRtr,
  apiPokemonRtr,
  hxGetPokemonRtr,
  hxListPokemonRtr,
  webDeleletePokemonRtr,
  webNewPokemonRtr,
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

// web

router.get('/', home)
router.get('/pokemon/new', newPoke) // must go before /pokemon/:id
router.get('/pokemon/:id', poke)
router.post(webNewPokemonRtr.POST.route, webNewPokemonRtr.POST.handler)
router.post(
  webDeleletePokemonRtr.POST.route,
  webDeleletePokemonRtr.POST.handler,
)

// API

router.get(apiPokemonRtr.GET.route, apiPokemonRtr.GET.handler)
router.put(apiGetPokemonRtr.PUT.route, apiGetPokemonRtr.PUT.handler)
router.get(apiGetPokemonRtr.GET.route, apiGetPokemonRtr.GET.handler)
router.delete(apiGetPokemonRtr.DELETE.route, apiGetPokemonRtr.DELETE.handler)

// htmx

router.get(hxGetPokemonRtr.GET.route, hxGetPokemonRtr.GET.handler)
router.get(hxListPokemonRtr.GET.route, hxListPokemonRtr.GET.handler)
