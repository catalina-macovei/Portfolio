function pokemonSiri(event) {
    try {
        const pokeInput = document.getElementById('pokemon');
        const pokeName = pokeInput.value.toLowerCase();

        if (pokeName.length > 2) {
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`)
            .then(data => data.json())             // promise
            .then(data => {
                console.log(data);
                showPokemon(data);
            })
            .catch((error) => {
                throw new Error("Couldn't find your pokemon:(")
            });
        } else {
            throw new Error("Pokemon name is too short! :(");
        }
    } catch(err) {
        handleError(err);
    }
}

function handleError(err) {
    console.log(err.message);
}

function showPokemon(pokemon) {
    const POKEMON_IMG = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
    const img = document.getElementById('pokemonImage');
    console.log(img, POKEMON_IMG, pokemon);
    img.setAttribute('src', POKEMON_IMG);
}