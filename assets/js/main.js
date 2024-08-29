const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const pokemonInfo = document.getElementById('pokemonInfo');

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">

                <button class="infoButton" onclick="showPokemonInfo(${pokemon.number})">Informações</button>
            </div>
        </li>
    `;
}
function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
    });
}

function showPokemonInfo(pokemonNumber) {
    // Fazendo uma nova requisição para o Pokémon específico
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`;

    fetch(url)
        .then((response) => response.json())
        .then((pokemon) => {
            const types = pokemon.types.map((typeSlot) => typeSlot.type.name);
            const abilities = pokemon.abilities.map((abilitySlot) => abilitySlot.ability.name);

            pokemonInfo.innerHTML = `
                <h2>${pokemon.name}</h2>
                <p><strong>Tipo:</strong> ${types.join(', ')}</p>
                <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
                <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
                <p><strong>Habilidades:</strong> ${abilities.join(', ')}</p>
                <img src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}">
            `;
            pokemonInfo.style.display = "block";
        });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});
