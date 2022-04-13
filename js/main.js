var evolutionChainLimit = 476 - 1

var emptySpaces = 6

async function getPokemon(memberNumber){
    const responseChain = await fetchChain()
    const evolutionaryChain = await responseChain.json();
    const urlPokemon = getFinalEvolution(evolutionaryChain.chain);
    const responseSpecies = await fetch(urlPokemon);
    const pokemonSpecies = await responseSpecies.json();
    const pokemonNumber = pokemonSpecies.id;
    const responsePokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`);
    const pokemon = await responsePokemon.json();
    document.getElementById(`${memberNumber}mon`).src = pokemon.sprites.front_default;  
}

async function fetchEvolution(){
    const generatedId = Math.floor(Math.random() * evolutionChainLimit) + 1;
    return await fetch(`https://pokeapi.co/api/v2/evolution-chain/${generatedId}`)
}

async function fetchChain(){
    var count = 0;
    var maxTries = 6;
    while(true) {
        try {
            const generatedId = /*Math.random()>0.5 ? */Math.floor(Math.random() * evolutionChainLimit) + 1 /*: 222*/;
            const chain = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${generatedId}`)
            return chain
        } catch (e) {
        }
    }
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
        if(document.getElementById(`${memberNumber}monlocked`) == null){
            getPokemon(memberNumber)
        }else{continue}
    }
}





async function clearImg(id, initialize = true){
    const img = document.getElementById(`${id}`)
    
    img.oncontextmenu = (e) => {
        e.preventDefault();
    }
    
    if (id.slice(4) == "locked"){
        return
    }
    const responseUnown = await fetch("https://pokeapi.co/api/v2/pokemon-form/10027/")
    const unown = await responseUnown.json()
    img.src = unown.sprites.front_default;
    if (initialize){
        lockPokemon(id);
    }
    console.log("hola")
}

async function showName(url){
    let id = url.slice(-7, -4)
    for (let i= 0; i < 2; i++){    
        if ((id[0] == "/") || (id[0] == "n")){
            id = id.slice((-2 + i))
        }
    }
    if (id == "ion"){
        id = 201
    }
    let name = await getNameById(id) 
    let namePlaceHolder = document.querySelector(".namePlaceHolder")
    namePlaceHolder.textContent = name
}

async function getNameById(id){
    const responsePokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await responsePokemon.json();
    return (pokemon.name[0].toUpperCase() + pokemon.name.slice(1))
}


function lockPokemon(id){
    if (id.slice(4) == "locked"){
        const lockedImage = document.getElementById(`${id}`)
        lockedImage.style.borderColor = '#222222'
        lockedImage.id = id.slice(-10, 4)
    }else{
        const lockedImage = document.getElementById(`${id}`) 
        lockedImage.style.borderColor = '#da1d1d'
        lockedImage.id  = `${id}locked`
    }
}

function initialize(){
    for (let init = 1; init <= 6; init++ ){
        clearImg(`${init}mon`, false);
    }
}



initialize();