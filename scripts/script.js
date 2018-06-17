
function clearAll() {
    localStorage.clear();
    const ul = document.getElementById('caught');
    while (ul.hasChildNodes()) {
        ul.removeChild(ul.lastChild);
    }
}

// side effect display on screen
function populatePokemon(name, id, pic) {
    const ul = document.getElementById('caught');
    const li = document.createElement('li');
    const div = document.createElement('div');
    const h4 = document.createElement('h4');
    const img = document.createElement('img');

    img.setAttribute('src', pic);
    h4.appendChild(document.createTextNode(`#${id} ${name}`));
    div.appendChild(h4);
    div.appendChild(img);
    li.appendChild(div);
    ul.appendChild(li);
}

function generatePokedex() {
    if(localStorage.myPokemonIds) {
        const ids = localStorage.myPokemonIds.split('&&');
        const names = localStorage.myPokemonNames.split('&&');
        const pics = localStorage.myPokemonPics.split('&&');

        const myPokemon = ids.map((indentifier, i) => ({
            id: indentifier,
            name: names[i],
            pic: pics[i]
        }));

        myPokemon.forEach(p => {
            populatePokemon(p.name, p.id, p.pic);
        });        
    }
}

function addNewPokemon({id, name, sprites}) {
    localStorage.myPokemonIds = localStorage.myPokemonIds ? (localStorage.myPokemonIds + '&&' + id) : id; 
    localStorage.myPokemonNames = localStorage.myPokemonNames ? (localStorage.myPokemonNames + '&&' + name) : name; 
    localStorage.myPokemonPics = localStorage.myPokemonPics ? (localStorage.myPokemonPics + '&&' + sprites.front_default) : sprites.front_default; 
    populatePokemon(name, id, sprites.front_default);
}

// http call and sideeffects, not pure
async function findPokemon() { 
    const genOne = Math.floor(Math.random() * 151) + 1;
    await fetch(`http://pokeapi.salestock.net/api/v2/pokemon/${genOne}`)
        .then(response => response.json())
        .then(data => addNewPokemon(data));
}

window.onload = generatePokedex;
