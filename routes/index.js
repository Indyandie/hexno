import { Router } from './Router.js'
import { pokemon, pokeHTMX } from './pokemon.js'
import { srvFl } from '../deps.js'

export const router = new Router();

const home = (req) => {
  return srvFl(req, './public/index.html');
}

router.get('/', home)
router.get(pokemon.GET.route, pokemon.GET.handler)
router.get(pokeHTMX.GET.route, pokeHTMX.GET.handler)
