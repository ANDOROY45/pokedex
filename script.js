const searchInput= document.querySelector(".recherche-poke input");
let allPokemon= [];
let tableauFin= [];
const listePoke= document.querySelector('.liste-poke');
const limite= 75;
var PokeNombreDebut= 21;
const chargement = document.querySelector('.loader')



var types= {
    bug: '#a8b820',
    dark: '#705848',
    dragon: '#7038f8',
    electric: '#f8d030',
    fairy: '#ee99ac',
    fighting: '#c03028',
    fire: '#f08030',
    flying: '#a890f0',
    ghost: '#705898',
    grass: '#78c850',
    ground: '#e0c068',
    ice: '#98d8d8',
    normal: '#a8a878',
    poison: '#a040a0',
    psychic: '#f85888',
    rock: '#b8a038',
    steel: '#b8b8d0',
    water: '#6890f0',
    immune: '#d6d6d6',
    noteffective: '#fdd0d0',
    veryeffective: '#ccfbcc',
};



function fetchPokemonBase(){
    const promises =[]

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limite}`)
     .then(reponse => reponse.json())
     .then((allPoke) =>{
        allPoke.results.forEach((pokemon) =>{
            promises.push(fetchPokemonComplet(pokemon).catch(error => console.error(error)));
        })
     })
     .then(() => {
        Promise.all(promises)
          .then(() => {
            tableauFin= allPokemon.sort((a, b) => {
                return a.id - b.id;
            }).slice(0, PokeNombreDebut);

            createCard(tableauFin);
            chargement.style.display = "none"
            
          })
     })
}   

let counter = 0
function fetchPokemonComplet(pokemon){
    let objPokemonFull = {};
    let url = pokemon.url;
    let nameP = pokemon.name;
    return fetch(url)
       .then(reponse => reponse.json())
       .then((pokeData) => {
           counter++;
           objPokemonFull.pic = pokeData.sprites.front_default;
           objPokemonFull.type = pokeData.types[0].type.name;
           objPokemonFull.id = pokeData.id;
           return fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameP}`)
                .then(reponse => reponse.json())
                .then((pokeData) => {
                    objPokemonFull.name= pokeData.names[4].name;
                    allPokemon.push(objPokemonFull);

                })
       });
}


function createCard(arr){

    for(let i= 0; i< arr.length; i++){

        const carte= document.createElement("li");
        carte.classList.add('hoverableCarte')
        let couleur= types[arr[i].type];
        carte.style.background= couleur;
        const txtCarte= document.createElement('h5');
        txtCarte.innerText= arr[i].name;
        const idCarte= document.createElement('p');
        idCarte.innerText=`ID# ${arr[i].id}`;
        const imgCarte= document.createElement('img');
        imgCarte.src= arr[i].pic;

        carte.appendChild(imgCarte);
        carte.appendChild(txtCarte);
        carte.appendChild(idCarte);

        listePoke.appendChild(carte);
    }
}
(fetchPokemonBase());


searchInput.addEventListener("input", function(e){

    if(e.target.value !== ""){
        e.target.parentNode.classList.add("active-input");
    }else{
        e.target.parentNode.classList.remove("active-input");
    }  
});

window.addEventListener('load', (e) =>{
    if(searchInput.value !== ""){
        searchInput.parentNode.classList.add("active-input");
    }
})


let index= PokeNombreDebut;

window.addEventListener('scroll', ()=>{
     
    const {scrollTop, scrollHeight, clientHeight} =document.documentElement;

    if(clientHeight + scrollTop >= scrollHeight - 20){
        addPoke(6);
    }
})

function addPoke(nb){
    if(index> counter){
        return;
    }
    const arrToAdd= allPokemon.slice(index, index + nb);
    createCard(arrToAdd);
    index+= nb;
}



const formSearch = document.querySelector('form');
formSearch.addEventListener('submit', (e) =>{
    e.preventDefault();
    recherche();
})

function recherche(){
    if(index < counter){
        addPoke(counter - index);
    }

    let filter, allLi, titleValue, allTiltes;
    filter = searchInput.value.toUpperCase();
    allLi= document.querySelectorAll('li');
    allTiltes= document.querySelectorAll("li > h5");

    for(i= 0; i< allLi.length; i++){
        
        titleValue= allTiltes[i].innerText;
        if(titleValue.toUpperCase().indexOf(filter) > -1){
            allLi[i].style.display="flex";
        }else{
            allLi[i].style.display="none";
        }
    }
}

