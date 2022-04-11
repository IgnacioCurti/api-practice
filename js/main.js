var evolutionChainLimit = 476

var emptySpaces = 6

async function getPokemon(memberNumber){
    const id = 99//Math.floor(Math.random() * evolutionChainLimit);
    const responseChain = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}`);
    const evolutionaryChain = await responseChain.json();
    const urlPokemon = getFinalEvolution(evolutionaryChain.chain)
    console.log(urlPokemon)
    const responsePokemon = await fetch(urlPokemon);
    const pokemon = responsePokemon.json();
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
        getFinalEvolution(object.evolves_to[randomEvoNumber - 1])
    } else {findSpeciesByEvolvesTo(object, isArrayFlag)}
}


function findSpeciesByEvolvesTo(object, isArrayFlag) {
    if (isArrayFlag){

    } else{return object.species.name}
}

function getTeam(){
        for (let memberNumber = 1; memberNumber <= emptySpaces; memberNumber++){
        getPokemon(memberNumber)
        }
}

function clearImg(){
}
