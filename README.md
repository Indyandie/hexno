# htmx Example

This repository is a playground to test the [htmx](https://htmx.org/) library. It has a simple API (built with [deno](https://deno.com/)) with htmx operations that respond with `html` fragments, it uses pokemon data.

## Dependencies

- [deno](https://deno.com/)
- [htmx](https://htmx.org/)

## Playground

### Getting started

1. run `deno task start` to start server
2. go to [localhost:8000](http://localhost:8000/)
3. Use [`/public`](./public/) to edit/add `html`, `css`, and `js` client files
4. Use `mod.js`, `/models`, `/services`, `/controllers`, and `/routes` to update the server

### Deno

| task    | description                                                                                     |
| ------- | ----------------------------------------------------------------------------------------------- |
| `seed`  | Generate `CSV` data file                                                                        |
| `start` | Start server on localhost, port `8000`. Uses `--allow-net`, `--allow-read`, and `--watch` flags |

## To do

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
- [ ] **Hypermedia API** ([htmx](https://htmx.org/) support)
  - [x] `GET` operations
  - [ ] `PUT` operations
  - [ ] `POST` operations
  - [ ] `PATCH` operations?
  - [ ] `DELETE` operations
- [x] Basic router
- [ ] Use a proper html parser
- [ ] Try using hono or oak

## Resources

- [htmx examples](https://htmx.org/examples/)
- [awesome-htmx](https://github.com/rajasegar/awesome-htmx)
- [deno docs](https://docs.deno.com/runtime/manual)
- [pokeapi](https://pokeapi.co/)
- [official pokedex](https://www.pokemon.com/us/pokedex)
