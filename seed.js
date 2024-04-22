import { csvParse, csvStringify } from "./deps.js";

/**
 * @typedef {object} Pokemon
 * @property {number} id
 * @property {string} name
 * @property {number} weight
 * @property {number} height
 * @property {string} types
 * @property {string} sprite - URL
 * @property {string} cries - URL
 */

/**
 * Fetch pokemon data and return filter object.
 * @param {string} url - https://pokeapi.co/api/v2/pokemon/:id
 * @return {Pokemon} pokemon: id, name, weight, height, types, sprite, cries
 */
async function fetchPokeData(url) {
  const resp = await fetch(url);
  const text = await resp.text();
  const data = JSON.parse(text);
  const pokeData = {
    id: data.id,
    name: data.name,
    weight: data.weight,
    height: data.height,
    types: data.types[0].type.name,
    sprite: data.sprites["front_default"],
    cries: data.cries.latest,
  };
  return pokeData;
}

let pokelist = await fetch(
  "https://pokeapi.co/api/v2/pokemon?limit=251&offset=0",
);
pokelist = await pokelist.text();
pokelist = JSON.parse(pokelist).results;

let pokemap = await Promise.all(
  pokelist.map((poke) => fetchPokeData(poke.url)),
);

let pokeCSV = csvStringify(pokemap, {
  columns: [
    "id",
    "name",
    "weight",
    "height",
    "types",
    "sprite",
  ],
});

pokeCSV = pokeCSV.replace(/-/g, "_");

await Deno.writeTextFile("./models/pokemon.csv", pokeCSV);
