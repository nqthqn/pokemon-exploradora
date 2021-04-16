import "./App.css";
import create from "zustand";
import React from "react";

const POKEMON_URL =
  "https://gist.githubusercontent.com/jherr/23ae3f96cf5ac341c98cd9aa164d2fe3/raw/f8d792f5b2cf97eaaf9f0c2119918f333e348823/pokemon.json";

const useStore = create((set) => ({
  filter: "",
  pokemon: [],
  sortBy: "Attack",
  typeFilter: "",
  loading: true,
  setLoading: (loading) => set((state) => ({ ...state, loading })),
  setFilter: (filter) => set((state) => ({ ...state, filter })),
  setTypeFilter: (typeFilter) => set((state) => ({ ...state, typeFilter })),
  setPokemon: (pokemon) => set((state) => ({ ...state, pokemon })),
  setSortBy: (sortBy) => set((state) => ({ ...state, sortBy })),
}));

const FilterInput = () => {
  const filter = useStore((state) => state.filter);
  const setFilter = useStore((state) => state.setFilter);
  return (
    <label class="input">
      Filter by Name
      <input value={filter} onChange={(evt) => setFilter(evt.target.value)} />
    </label>
  );
};

const baseValueSort = (k) => (a, b) => {
  return b["base"][k] - a["base"][k];
};

const DropdownInput = () => {
  const setTypeFilter = useStore((state) => state.setTypeFilter);
  const typeFilter = useStore((state) => state.typeFilter);
  return (
    <label class="input">
      Select Type
      <select
        value={typeFilter}
        onChange={(evt) => setTypeFilter(evt.target.value)}
      >
        <option value="">All</option>
        <option value="Normal">Normal</option>
        <option value="Grass">Grass</option>
        <option value="Steel">Steel</option>
        <option value="Dragon">Dragon</option>
        <option value="Flying">Flying</option>
      </select>
    </label>
  );
};

const PokemonTable = () => {
  const pokemon = useStore((state) => state.pokemon);
  const filter = useStore((state) => state.filter);
  const typeFilter = useStore((state) => state.typeFilter);

  const loading = useStore((state) => state.loading);

  const sortBy = useStore((state) => state.sortBy);
  const setSortBy = useStore((state) => state.setSortBy);

  if (loading) {
    return <div class="spinner"></div>;
  }

  return (
    <table>
      <tbody>
        <tr>
          <th>Name</th>
          <th>Japanese</th>
          <th>Type</th>

          <th>
            <button onClick={() => setSortBy("HP")}>HP ⇅</button>
          </th>
          <th>
            <button onClick={() => setSortBy("Attack")}>Attack ⇅</button>
          </th>
          <th>
            <button onClick={() => setSortBy("Defense")}>Defense ⇅</button>
          </th>
          <th>
            <button onClick={() => setSortBy("Sp. Attack")}>
              Sp. Attack ⇅
            </button>
          </th>
          <th>
            <button onClick={() => setSortBy("Sp. Defense")}>
              Sp. Defense ⇅
            </button>
          </th>
          <th>
            <button onClick={() => setSortBy("Speed")}>Speed ⇅</button>
          </th>
        </tr>
        {pokemon
          .filter(({ name: { english } }) =>
            english.toLowerCase().includes(filter.toLowerCase())
          )
          .filter(({ type }) =>
            type.join(", ").toLowerCase().includes(typeFilter.toLowerCase())
          )
          .sort(baseValueSort(sortBy))
          .map(({ id, name: { english, japanese }, type, base }) => (
            <tr key={id}>
              <td>{english}</td>
              <td>{japanese}</td>
              <td>{type.join(", ")}</td>

              <td class={sortBy === "HP" ? "activeCell" : ""}>{base["HP"]}</td>
              <td class={sortBy === "Attack" ? "activeCell" : ""}>
                {base["Attack"]}
              </td>
              <td class={sortBy === "Defense" ? "activeCell" : ""}>
                {base["Defense"]}
              </td>
              <td class={sortBy === "Sp. Attack" ? "activeCell" : ""}>
                {base["Sp. Attack"]}
              </td>
              <td class={sortBy === "Sp. Defense" ? "activeCell" : ""}>
                {base["Sp. Defense"]}
              </td>
              <td class={sortBy === "Speed" ? "activeCell" : ""}>
                {base["Speed"]}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

function App() {
  const setPokemon = useStore((state) => state.setPokemon);
  const setLoading = useStore((state) => state.setLoading);

  React.useEffect(() => {
    fetch(POKEMON_URL)
      .then((resp) => resp.json())
      .then((pokemon) => {
        setLoading(false);
        setPokemon(pokemon);
      });
  });

  return (
    <div className="App">
      <h1>Pokemon Exploradora</h1>
      <a href="https://github.com/nqthqn/pokemon-exploradora">Source Code</a>
      <div class="filters">
        <FilterInput />
        <DropdownInput />
      </div>
      <PokemonTable />
    </div>
  );
}

export default App;
