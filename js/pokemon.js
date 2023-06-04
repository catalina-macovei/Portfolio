function pokemonSiri(event) {
    try {
        const pokeInput = document.getElementById('pokemon');
        const pokeName = pokeInput.value.toLowerCase();

        if (pokeName.length > 2) {
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`)  // folosesc fetch api pentru a returna img cu pokemon 
            .then(data => {
                data.json().then(data => {
                    cleanUp();
                    showPokemon(data);
                }).catch((error) => {
                    handleError();
                });
            })             // promise
            .catch((error) => {
                handleError("Couldn't find your pokemon:(");
            });
        } else {
           handleError("Pokemon name is too short! :(");
        }
    } catch(err) {
        handleError("Couldn't find your pokemon:(");
    }
}

function handleError(message) {
    const errElement = document.querySelector('.pokemon-search__error');
    errElement.textContent = message || 'Something went wrong, try again later.';
}

// display la img cu pokemon:
function showPokemon(pokemon) {
    const POKEMON_IMG = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
    
    const img = document.getElementById('pokemonImage');
    img.setAttribute('src', POKEMON_IMG);
}

function cleanUp() {
    const errElement = document.querySelector('.pokemon-search__error');
    errElement.textContent = "";
}
