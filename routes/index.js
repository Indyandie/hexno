import { Router } from './Router.js'
import {
  apiGetPokemonRtr,
  apiListPokemonRtr,
  hxGetPokemonRtr,
  hxListPokemonRtr,
} from './pokemon.js'
import { srvFl } from '../deps.js'

export const router = new Router()

const home = (req) => {
  return srvFl(req, './public/index.html')
}
const poke = (req) => {
  return srvFl(req, './public/pokemon/index.html')
}

router.get('/', home)
router.get('/pokemon/:id', poke)
router.get(apiGetPokemonRtr.GET.route, apiGetPokemonRtr.GET.handler)
router.get(apiListPokemonRtr.GET.route, apiListPokemonRtr.GET.handler)
router.get(hxGetPokemonRtr.GET.route, hxGetPokemonRtr.GET.handler)
router.get(hxListPokemonRtr.GET.route, hxListPokemonRtr.GET.handler)
