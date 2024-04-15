import { Router } from './Router.js'
import { pokemon, pokeHTMX } from './pokemon.js'

export const router = new Router();

router.get( pokemon.GET.route, pokemon.GET.handler)
router.get( pokeHTMX.GET.route, pokeHTMX.GET.handler)
