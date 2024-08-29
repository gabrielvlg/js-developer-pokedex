const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const pokemonInfo = document.getElementById('pokemonInfo');

const maxRecords = 151
const limit = 10
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

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

function showPokemonInfo(pokemonNumber) {
    pokeApi.getPokemons(offset, limit).then((pokemons) => {
        const pokemon = pokemons.find(p => p.number === pokemonNumber);
        if (pokemon) {
            pokemonInfo.innerHTML = `
                <h2>${pokemon.name}</h2>
                <p><strong>Tipo:</strong> ${pokemon.type}</p>
                <p><strong>Altura:</strong> ${pokemon.height} m</p>
                <p><strong>Peso:</strong> ${pokemon.weight} kg</p>
                <p><strong>Habilidades:</strong> ${pokemon.abilities.join(', ')}</p>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            `;
            pokemonInfo.style.display = "block";
        }
    });
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})