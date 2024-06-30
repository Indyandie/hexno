import { Router } from './Router.js'
import { pokemonList, pokemon, pokeHTMX, htmxPokeRouter } from './pokemon.js'
import { srvFl } from '../deps.js'

export const router = new Router();

const home = (req) => {
  return srvFl(req, './public/index.html');
}
const poke = (req) => {
  return srvFl(req, './public/pokemon/index.html');
}

router.get('/', home)
router.get('/pokemon/:id', poke)
router.get(pokemon.GET.route, pokemon.GET.handler)
router.get(pokemonList.GET.route, pokemonList.GET.handler)
router.get(htmxPokeRouter.GET.route, htmxPokeRouter.GET.handler)
router.get(pokeHTMX.GET.route, pokeHTMX.GET.handler)
