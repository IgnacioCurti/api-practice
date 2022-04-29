class PokemonService {
    #baseUrl;
    #allPokemonSpecies;
    constructor() {
        this.#baseUrl = "https://pokeapi.co/api/v2/";
        this.#allPokemonSpecies = null;
    }
    async getAllPokemonSpecies() {
        if (!this.#allPokemonSpecies) {
            this.#allPokemonSpecies = await (await fetch(`${this.#baseUrl}pokemon-species?limit=100000&offset=0`).catch((e) => console.error(e))).json();
        }
        return this.#allPokemonSpecies;
    }
    async getPokemon(id) {
        return await (await fetch(`${this.#baseUrl}pokemon-species/${id}`).catch((e) => console.error(e))).json();
    }
    async getRandomPokemon() {
        const { results, count } = await this.getAllPokemonSpecies();
        const randomPokemon = results[Math.floor(Math.random() * count)];
        return await this.getPokemon(randomPokemon.name);
    }
}

const pokemonService = new PokemonService();


const urlBase = `https://pokeapi.co/api/v2/`

const pokemonLimit = 898


function title(string) {
    return string[0].toUpperCase() + string.slice(1)
}

async function getPokemon(memberNumber, currentMembers){
    const evolutionaryChain = await fetchChain(currentMembers)
    const urlPokemon = getFinalEvolution(evolutionaryChain.chain);
    const pokemonSpecies = await(await fetch(urlPokemon)).json();
    const pokemon = await (await fetch(`${urlBase}pokemon/${pokemonSpecies.id}`)).json();
    document.getElementById(`${memberNumber}mon`).src = pokemon.sprites.front_default;
    return pokemon.id  
}


async function fetchChain(currentMembers){
    let generatedId = undefined
    do{
    generatedId = Math.floor(Math.random() * pokemonLimit) + 1 ;
    }while(currentMembers.includes(generatedId))
    const species = await (await fetch(`${urlBase}pokemon-species/${generatedId}`) ).json()
    return await (await fetch(species.evolution_chain.url)).json()
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
    const currentMembers = [];
    for (let memberNumber = 1; memberNumber <= 6; memberNumber++){
        if(document.getElementById(`${memberNumber}monlocked`) == null){
            currentMembers.push(getPokemon(memberNumber, currentMembers))
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