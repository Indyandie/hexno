# hexno

htmx + deno = :heart:

[pokeapi]: https://pokeapi.co/

This repository is a playground to test the [htmx](https://htmx.org/) library. It has a simple API (built with [deno](https://deno.com/)) with htmx operations that respond with `html` fragments, it uses [pokemon][pokeapi] data.

## Dependencies

- [deno](https://deno.com/)
- [htmx](https://htmx.org/)

## Playground

### Getting started

1. run `deno task seed` to populate data.
1. run `deno task start` to start server
1. go to [localhost:8000](http://localhost:8000/)
1. Use [`/public`](./public/) to edit/add `html`, `css`, and `js` client files
1. Use `mod.js`, `/models`, `/services`, `/controllers`, and `/routes` to update the server

### Deno

| task    | description                                                                                     |
| ------- | ----------------------------------------------------------------------------------------------- |
| `seed`  | Generate `CSV` data file                                                                        |
| `start` | Start server on localhost, port `8000`. Uses `--allow-net`, `--allow-read`, and `--watch` flags |

## To do

### v0.1.0

- [x] **Web 1.0**
  - [x] pokemon list (home)
  - [x] create pokemon
  - [x] read pokemon
  - [x] update pokemon
  - [x] delete pokemon
- [x] **Data API**
  - [x] pokemon list
  - [x] create pokemon
  - [x] read pokemon
  - [x] update pokemon
  - [x] delete pokemon
- [x] **Hypermedia API** ([htmx](https://htmx.org/) support)
  - [x] `GET` operations
  - [x] `PUT` operations
  - [x] `POST` operations
  - [x] `PATCH` operations?
  - [x] `DELETE` operations
- [x] Basic router

### v0.1.0

- [ ] Use a proper html parser
- [ ] Try using hono or oak

## Resources

- [htmx examples](https://htmx.org/examples/)
- [awesome-htmx](https://github.com/rajasegar/awesome-htmx)
- [deno docs](https://docs.deno.com/runtime/manual)
- [pokeapi]
- [official pokedex](https://www.pokemon.com/us/pokedex)
