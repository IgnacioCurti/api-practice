var evolutionChainLimit = 476

var emptySpaces = 6

async function getPokemon(memberNumber){
    const id = 33//Math.floor(Math.random() * evolutionChainLimit);
    const responseChain = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}`);
    const evolutionaryChain = await responseChain.json();
    const urlPokemon = getFinalEvolution(evolutionaryChain.chain);
    console.log(urlPokemon);
    const responseSpecies = await fetch(urlPokemon);
    const pokemonSpecies = await responseSpecies.json();
    console.log(pokemonSpecies);
    const pokemonName = pokemonSpecies.name;
    const responsePokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const pokemon = await responsePokemon.json();
    document.getElementById(`${memberNumber}mon`).src = pokemon.sprites.front_default;  
}

function getFinalEvolution(object) {
    let arrayEvolvesTo
    let isArrayFlag = false
    if (Array.isArray(object)) {
        arrayEvolvesTo = object;
        isArrayFlag = true
    }else{
        arrayEvolvesTo = object.evolves_to;
    }
    if (arrayEvolvesTo.length > 0){
        const randomEvoNumber = Math.floor(Math.random() * object.evolves_to.length)
        console.log("increiblementellegué acá 1")

        getFinalEvolution(object.evolves_to[randomEvoNumber - 1])
        console.log("increiblementellegué acá 2")

    } else {return findSpeciesByEvolvesTo(object, isArrayFlag)}
}


function findSpeciesByEvolvesTo(object, isArrayFlag) {
    console.log("increiblementellegué acá 3")
    if (isArrayFlag){
        console.log("increiblementellegué acá 4")

    } else{return object.species.url}
}

function getTeam(){
        for (let memberNumber = 1; memberNumber <= emptySpaces; memberNumber++){
        getPokemon(memberNumber)
        }
}

function clearImg(){
}
