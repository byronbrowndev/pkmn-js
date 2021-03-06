
function clearAll() {
    localStorage.clear();
    const ul = document.getElementById('caught');
    while (ul.children.length > 1) { ul.removeChild(ul.firstElementChild); }
}

// side effect display on screen
function populatePokemon(name, id, pic) {
    const ul = document.querySelector('#caught');
    const spinner = document.querySelector('#spinner');
    const li = document.createRange().createContextualFragment(`
        <li>
            <div>
                <h4>#${id} ${name}</h4>
                <img src=${pic}>
            </div>
        </li>
    `);
    ul.insertBefore(li, spinner);
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

// http call and side effects, not pure
async function findPokemon() { 
    document.getElementById('spinner').style.display = 'flex';
    document.getElementById('findButton').disabled = true;
    document.getElementById('clearButton').disabled = true;
    const genOne = Math.floor(Math.random() * 151) + 1;
    const ownCheck = ownershipCheck(genOne);
    if (ownCheck < 0) {
        await fetch(`https://pokeapi.co/api/v2/pokemon/${genOne}/`)
            .then(response => response.json())
            .then(data => addNewPokemon(data))
            .then(() => hideSpinner());
    } else {
        alert('you already have a ' + ownCheck)
    }
}

function hideSpinner() {
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('findButton').disabled = false;
    document.getElementById('clearButton').disabled = false;
}

function ownershipCheck(id) {
    const thePkmnIdIndex = localStorage.myPokemonIds ? localStorage.myPokemonIds.split('&&').findIndex(i => parseInt(i) === id) : -1;
    if (thePkmnIdIndex < 0) { return thePkmnIdIndex }
    hideSpinner();
    return localStorage.myPokemonNames.split('&&')[thePkmnIdIndex];
}

window.onload = generatePokedex;
