
// Hämta alla image-blocks i html
const blocks = document.querySelectorAll('.image-block');


// clearActiveBlocks funktionen som vi kallar på i for-lopen
// för som kollar av aktivitet för click image blocks

function clearActiveBlocks(activeBlock) {

  // En for loop som Loopar igenom alla block i samlingen.
  //( )Note to sel: man skriver for-loop med "of" i javascript)
  for (const block of blocks) {

    // Kontrollera att detta block inte är det block som precis klickades.
    // (Vi vill inte ta bort 'active' från det block som ska förbli valt.)
    if (block !== activeBlock) {

      // Om blocket är markerat som aktivt...
      if (block.classList.contains('active')) {

        // ...ta bort 'active' så att blocket avmarkeras.
        block.classList.remove('active');
      }
    }
  }
}

// Funktion som kopplar filterArt och clearActiveBlocks till en lista av block
function setupFilterBlocks(blockList) {

  for (const block of blockList) {
    block.addEventListener('click', function () {

      const filter = block.dataset.period;  // eller annan kategori som vi har skapat i html

      if(block.classList.contains('active')) {
        block.classList.remove('active');
        return;
      }
      clearActiveBlocks(block);

      block.classList.add('active');

      filterArt(filter);
    });
  }
}

setupFilterBlocks(blocks);
removePlaceholderText();

//Hämtar och skickar tillbaka information från API:t

async function filterArt(filterTerm){

  if (!filterTerm) return;

  // Hämta konstverken baserat på filter
  const artworks = await fetchArt(filterTerm);  // samma fetchArt, men skickar filter internt
  renderArtWorks(artworks);
}

async function fetchArt(searchTerm){
 // reternerar en tom lista om det inte finns något argument

  if(!searchTerm){return [];}
  try{
    //Hämtar och väntar på svar
    const response = await fetch(
      `https://api.artic.edu/api/v1/artworks/search`
      + `?q=${encodeURIComponent(searchTerm)}` // Sökordet matas in
      + `&query[term][is_public_domain]=true`
      + `&fields=id,title,artist_title,image_id`
      + `&limit=50`);

    // Svaret tillbaka från api converterad till en json fil
    const apiResponse = await response.json();

    // filtrera bort verk utan bild
    const artworkWithImages = apiResponse.data.filter(art => art.image_id);

    // returnerar ett begränsat antalal bilder
    return artworkWithImages.slice(0, 10);

  }
  // om vi inte får tillbaka någon data
  catch(error){
    console.error("Error fetching artworks:", error);
    alert("Error fetching image data");
    return [];
  }
}

//Separat funktion för hantering av resultat
function renderArtWorks(artworks) {

  // Hämta huvud-divarna där sökresultatet ska visas
  const imageResultContainer = document.getElementById('art-results');
  const textResultContainer = document.getElementById('search-result-container');

  // Töm tidigare sökresultat i båda containrarna
  imageResultContainer.innerHTML = '';
  textResultContainer.innerHTML = '';

  // Om inga resultat hittas – visa meddelande och avbryt funktionen
  if(artworks.length === 0){
    alert("No artworks found.");
    textResultContainer.textContent = 'No images available for this search!';
    return;
  }
  // Visa hur många träffar sökningen gav
  textResultContainer.textContent = `Your search resulted in ${artworks.length} hits`;

  // Loopa igenom alla konstverk och skapa HTML-element för varje
  for (let art of artworks) {

    //variabler som vi tilldelar:
    // Bildens URL (från API:ets IIIF-system)
    const imgUrl = `https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`;

    // Artistens namn eller fallback-värde
    const artist = art.artist_title || 'Unknown Artist';

    // Titel på verket eller fallback-värde
    const title = art.title || 'Untitled';

    // Skapa en container (div) för varje konstverksblock
    const artBlock = document.createElement('div');
    // Tilldela CSS-klassen som styr layout och utseende
    artBlock.classList.add('art-result-block');

    // Skapa bild-element och tilldela bildens URL
    const img = document.createElement('img');
    // tilldela bilder från api:t
    img.src = imgUrl;

    // Skapa text-element som beskriver titel och artist
    const p = document.createElement('p');
    p.innerText = `${title} - ${artist}`;

    // Lägg in bild och text i konstverksblocket
    artBlock.appendChild(img);
    artBlock.appendChild(p);

    // Lägg till konstverksblocket i bildcontainern
    imageResultContainer.appendChild(artBlock);

  }
}

// Funktion för att söka efter konstverk
async function searchArt(inputOveride = null){

  // Hämta sökfältet från DOM
  const inputField = document.getElementById('search-bar');

  // Hämta söktexten: använd inputOverride om det finns, annars använd värdet i sökfältet
  // trim() används för att ta bort mellanslag i början/slutet
  const searchValue = inputOveride || inputField.value.trim();

  // Avbryt funktionen om söktexten är tom
  if(!searchValue){return}

  // Hämta konstverken från API baserat på söktexten
  const artWorks = await fetchArt(searchValue);

  // Visa resultaten genom att rendera dem på sidan
  renderArtWorks(artWorks);
}

 function setupSearchButton(){
   const searchButton = document.getElementById('search-button')
    searchButton.addEventListener('click', () => searchArt());
 }
 setupSearchButton();


function removePlaceholderText(){
  let searchInput = document.getElementById('search-bar');
  searchInput.addEventListener('focus', function(){
    this.dataset.placeholderBackup = this.placeholder;
    this.placeholder = "";

    searchInput.addEventListener('blur', function(){
      if(this.value === ''){
        this.placeholder = this.dataset.placeholderBackup || 'Search by Artist....';
      }
    })
  });
}





// functionalitet för hamburgermaneyn

const hamburgerMenu = document.getElementById('hamburger-menu');
const menuList = document.getElementById('menu-list');

hamburgerMenu.addEventListener('click', function() {

  if(menuList.classList.contains('hidden')) {
    menuList.classList.remove('hidden');
  }else{
    menuList.classList.add('hidden');
  }
  //menuList.classList.toggle('hidden'); // togglar visning
  console.log(hamburgerMenu, menuList);
});



/*
for (const block of blocks) {
  block.addEventListener('click', function () {
    const filter = block.dataset.period;  // eller annan kategori

    // Kör filter utan att ändra search-bar
    filterArt(filter);

    // Markera blocket som aktivt
    clearActiveBlocks(block);

  });

}
*/

/*
for (const block of blocks) {
  block.addEventListener('click', function () {

    const period = block.dataset.period;

    // autopopulate searchbar
    document.getElementById('search-bar').value = period;

    // Starta sökning med period som parameter
    searchArt(period);

    // Markera valt block
    clearActiveBlocks(block);
  });
}

/*

//funktionalitet för search:

//Hämtar search knappen
const btn = document.getElementById('search-button');
//och lägger till en eventlistener.
btn.addEventListener('click', fetchArt);



async function fetchArt(artInput) {
 const input = document.getElementById('search-bar').value.trim();
  if (!input) return;

  //console.log("Sökterm:", input);

  try {
    // 1. Sök efter artworks i public domain med fält image_id
    const response = await fetch(
      `https://api.artic.edu/api/v1/artworks/search`
      + `?q=${encodeURIComponent(input)}`
      + `&query[term][is_public_domain]=true`
      + `&fields=id,title,artist_title,image_id`
      + `&limit=50`
    );

    const apiResponse = await response.json();
    //console.log("Returned artworks:", apiResponse.data.length);

    const resultsContainer = document.getElementById('art-results');
    resultsContainer.innerHTML = '';


    // 2. Filtrera bort artworks utan bild
    // 'art' är varje enskilt element i apiResponse.data som vi loopar igenom
    // Funktionen returnerar true om 'art' har en image_id, annars false
    // Endast de element som returnerar true hamnar i den nya listan
    const artworksWithImages = apiResponse.data.filter(function(art) {
      return art.image_id;
    });



    //console.log("With image_id:", artworksWithImages.length);
    const resultContainer = document.getElementById('search-result-container');
    //
    if (artworksWithImages.length === 0) {
      resultContainer.innerHTML = '';  // rensa texten
      alert("No images available for this search");
      return;
    }



    // 3. Visa alla (eller t.ex. max 10) verk med bilder

    const artworksToShow = artworksWithImages.slice(0, 10);



    resultContainer.innerHTML = ''; // rensa tidigare resultat



    // Lägg till en text som visar antal träffar
    const resultText = document.createElement('p');

    resultContainer.textContent = `Your search resulted in ${artworksToShow.length} hits`;


    for (const art of artworksToShow) {

      const imgUrl = `https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`;
      const artist = art.artist_title || "Unknown artist";
      const title = art.title || "Untitled";

      const artBlock = document.createElement('div');
      artBlock.classList.add('art-result-block');

      const img = document.createElement('img');
      img.src = imgUrl;

      const p = document.createElement('p');
      p.textContent = `${title} — ${artist}`;

      artBlock.appendChild(img);
      artBlock.appendChild(p);
      resultsContainer.appendChild(artBlock);
    }


  } catch (error) {
    console.error("Error fetching artworks:", error);
    alert("Error fetching image data");
  }
}


// test filter
// --- FILTER BY CLICKING IMAGE BLOCKS --- //

const periodBlocks = document.querySelectorAll('.image-block');

for (const block of periodBlocks) {
  block.addEventListener('click', function () {

    // 1. Hämta perioden från HTML
    const period = block.dataset.period;

    // 2. Fyll search-fältet med perioden
    const searchBar = document.getElementById('search-bar');
    searchBar.value = period;

    // 3. Starta sökningen direkt
    fetchArt(); // gör om och skicka in period som argument
    // flytta resultat utanför fetchart.

    // 4. Markera valt block
    clearActiveBlocks(block);


  });


}
*/








