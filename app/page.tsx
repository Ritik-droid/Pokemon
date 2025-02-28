"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Pokemon {
  name: string;
  url: string;
}

async function getPokemons() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=500");
  const data = await res.json();
  return data.results;
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      const data = await getPokemons();
      setPokemons(data);
    }
    fetchData();
  }, []);

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Pokémon Explorer</h1>
      

      <input
        type="text"
        placeholder="Search Pokémon..."
        className="w-full md:w-1/2 block mx-auto p-2 border rounded-lg mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredPokemons.length > 0 ? (
          filteredPokemons.map((pokemon, index) => {
            const id = index + 1;
            return (
              <li key={id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
                <Link href={`/pokemon/${id}`} className="text-blue-500 font-medium hover:underline">
                  {pokemon.name}
                </Link>
              </li>
            );
          })
        ) : (
          <p className="text-center col-span-2 md:col-span-4 text-gray-500">No Pokémon found</p>
        )}
      </ul>
    </div>
  );
}
