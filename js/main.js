var evolutionChainLimit = 476 - 1

var emptySpaces = 6

async function getPokemon(memberNumber){
    const id = Math.floor(Math.random() * evolutionChainLimit) + 1;
    const responseChain = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}`);
    const evolutionaryChain = await responseChain.json();
    const urlPokemon = getFinalEvolution(evolutionaryChain.chain);
    const responseSpecies = await fetch(urlPokemon);
    const pokemonSpecies = await responseSpecies.json();
    //console.log(pokemonSpecies);
    const pokemonNumber = pokemonSpecies.id;
    const responsePokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`);
    const pokemon = await responsePokemon.json();
    document.getElementById(`${memberNumber}mon`).src = pokemon.sprites.front_default;  
}

function getFinalEvolution(object, evoNumber = -1){
    if (evoNumber >= 0){
        return condition(object[evoNumber])
    } else{
        return condition(object)
    }    
}

function condition(object){
    if (object.evolves_to.length > 0){
        const randomEvoNumber = Math.floor(Math.random() * object.evolves_to.length)
        return (getFinalEvolution(object.evolves_to, randomEvoNumber))
    } else{
        return (object.species.url)
    }
}


function getTeam(){
        for (let memberNumber = 1; memberNumber <= emptySpaces; memberNumber++){
        getPokemon(memberNumber)
        }
}


function clearImg(){
}
