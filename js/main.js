class PokemonService {
    #baseUrl;
    #allPokemon;
    constructor() {
        this.#baseUrl = "https://pokeapi.co/api/v2/";
        this.#allPokemon = null;
    }
    async getAllPokemon() {
        if (!this.#allPokemon) {
            this.#allPokemon = await (await fetch(`${this.#baseUrl}pokemon?limit=100000&offset=0`).catch((e) => console.error(e))).json();
        }
        return this.#allPokemon;
    }
    async getPokemon(id) {
        return await (await fetch(`${this.#baseUrl}pokemon/${id}`).catch((e) => console.error(e))).json();
    }
    async getRandomPokemon() {
        const { results, count } = await this.getAllPokemon();
        const randomPokemon = results[Math.floor(Math.random() * count)];
        return await this.getPokemon(randomPokemon.name);
    }
}

const pokemonService = new PokemonService();


const urlBase = `https://pokeapi.co/api/v2/`

const evolutionChainLimit = 476 - 1

var emptySpaces = 6

function title(string) {
    return string[0].toUpperCase() + string.slice(1)
}

async function getPokemon(memberNumber){
    const responseChain = await fetchChain()
    const evolutionaryChain = await responseChain.json();
    const urlPokemon = getFinalEvolution(evolutionaryChain.chain);
    const responseSpecies = await fetch(urlPokemon);
    const pokemonSpecies = await responseSpecies.json();
    const pokemonNumber = pokemonSpecies.id;
    const responsePokemon = await fetch(`${urlBase}pokemon/${pokemonNumber}`);
    const pokemon = await responsePokemon.json();
    document.getElementById(`${memberNumber}mon`).src = pokemon.sprites.front_default;  
}



async function fetchChain(){
    // let count = 0;
    // let maxTries = 6;
    while(true) {
        try {
            const generatedId = Math.floor(Math.random() * evolutionChainLimit) + 1 ; //const generatedId = Math.random()>0.5 ? Math.floor(Math.random() * evolutionChainLimit) + 1 : 222;
            const chain = await fetch(`${urlBase}evolution-chain/${generatedId}`)
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
    img.addEventListener('contextmenu', event => event.preventDefault());
    if (id.slice(4) == "locked"){
        return
    }
    const responseUnown = await fetch(`${urlBase}pokemon-form/10027/`)
    const unown = await responseUnown.json()
    img.src = unown.sprites.front_default;
    if (initialize){
        lockPokemon(id);
    }
}


function getIdByImageURL(url){
    let id = url.slice(-7, -4)
    for (let i= 0; i < 2; i++){    
        if ((id[0] == "/") || (id[0] == "n")){
            id = id.slice((-2 + i))
        }
    }
    if (id == "ion"){
        id = 201
    }
    return id
}


async function showName(url){
    const id = getIdByImageURL(url)
    let name = await getNameById(id) 
    let namePlaceHolder = document.querySelector(".namePlaceHolder")
    namePlaceHolder.textContent = name
}


async function getNameById(id){
    const responsePokemon = await fetch(`${urlBase}pokemon/${id}`);
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


async function getPokedexText(id){
    const responsePokemon = await fetch(`${urlBase}pokemon/${id}`);
    const pokemon = await responsePokemon.json();
    const responseSpecies = await fetch(pokemon.species.url) 
    const species = await responseSpecies.json();
    for (let i = 0; i < species.flavor_text_entries.length; i++){
        if(species.flavor_text_entries[i].language.name == "en"){
            return species.flavor_text_entries[i].flavor_text
        }
    } 
    return "No english pokedex entry was found"
}


async function showInfo(url){
    const id = await getIdByImageURL(url);
    const titleText = document.querySelector('.alertTitle');
    titleText.textContent = await getNameById(id);
    const bodyText = document.querySelector('.alertContent');
    bodyText.textContent = await getPokedexText(id);
    document.querySelector('.alert').style.visibility = 'visible';
    showTypes(id);
}


async function showTypes(id){
    document.getElementById(`type1`).src = ""
    document.getElementById(`type2`).src = ""
    const responsePokemon = await fetch(`${urlBase}pokemon/${id}`);
    const pokemon = await responsePokemon.json();
    let count = 1
    for (let type of pokemon.types){
        document.getElementById(`type${count}`).src = `css/images/types/${type.type.name}.png`
        ++count
    }
}


initialize();


document.addEventListener('keydown', (event)=>{
    if (event.key === ' ' || event.key === 'Escape' || event.key === 'Enter'){
        document.querySelector('.alert').style.visibility = 'hidden'
    }
})