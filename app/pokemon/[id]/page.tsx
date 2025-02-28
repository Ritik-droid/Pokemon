import Image from "next/image";
import { notFound } from "next/navigation";

interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  types: { type: { name: string } }[];
  stats: { base_stat: number; effort: number; stat: { name: string } }[];
  sprites: { front_default: string; front_shiny: string };
  species: { name: string; url: string };
  moves: { move: { name: string } }[];
  cries: { latest: string; legacy: string };
}

async function getPokemon(id: string): Promise<Pokemon | null> {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (!res.ok) return null; 

    return res.json();
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    return null;
  }
}

export default async function PokemonDetail({ params }: { params: { id: string } }) {
  const pokemon = await getPokemon(params.id);

  if (!pokemon) return notFound(); 

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-5xl font-bold capitalize text-yellow-400 drop-shadow-lg">{pokemon.name}</h1>

      <div className="flex gap-6 my-6">
        <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
          <Image src={pokemon.sprites.front_default} alt={pokemon.name} width={180} height={180} />
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
          <Image src={pokemon.sprites.front_shiny} alt={`${pokemon.name} shiny`} width={180} height={180} />
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-xl text-center">
        <p className="text-lg">
          <strong className="text-yellow-400">Pokédex ID:</strong> {pokemon.id}
        </p>
        <p className="text-lg">
          <strong className="text-yellow-400">Base Experience:</strong> {pokemon.base_experience}
        </p>
        <p className="text-lg">
          <strong className="text-yellow-400">Height:</strong> {pokemon.height / 10} m
        </p>
      </div>

      <div className="mt-6 bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-xl text-center">
        <h2 className="text-2xl font-semibold text-yellow-400">Abilities</h2>
        <ul className="flex flex-wrap justify-center gap-2 mt-2">
          {pokemon.abilities.map((a, i) => (
            <li
              key={i}
              className={`px-4 py-2 rounded-lg ${
                a.is_hidden ? "bg-gray-600" : "bg-yellow-500 text-gray-900"
              } shadow-md`}
            >
              {a.ability.name} {a.is_hidden && "(Hidden Ability)"}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-xl text-center">
        <h2 className="text-2xl font-semibold text-yellow-400">Types</h2>
        <div className="flex justify-center gap-4 mt-2">
          {pokemon.types.map((t, i) => (
            <span key={i} className="px-4 py-2 bg-green-500 text-gray-900 rounded-lg shadow-md">
              {t.type.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-xl text-center">
        <h2 className="text-2xl font-semibold text-yellow-400">Stats</h2>
        <ul className="grid grid-cols-2 gap-4 mt-2">
          {pokemon.stats.map((s, i) => (
            <li key={i} className="bg-gray-700 px-4 py-2 rounded-lg shadow-md">
              {s.stat.name}: <span className="font-bold">{s.base_stat}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-xl text-center">
        <h2 className="text-2xl font-semibold text-yellow-400">Moves</h2>
        <p className="mt-2 text-sm">{pokemon.moves.slice(0, 10).map((m) => m.move.name).join(", ")}</p>
      </div>

      <div className="mt-6 bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-xl text-center">
        <h2 className="text-2xl font-semibold text-yellow-400">Pokémon Cry</h2>
        <audio controls className="mt-2">
          <source src={pokemon.cries.latest} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
}
