
// Hämta alla image-blocks i html
const blocks = document.querySelectorAll('.image-block');


// clearActiveBlocks funktionen som vi kallar på i for-lopen
// för som kollar av aktivitet för click image blocks
function clearActiveBlocks(activeBlock) {

  // En for loop som Loopar igenom alla block i samlingen.
  //( )Note to self: man skriver for-loop med "of" i javascript)
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

// Funktion som kopplar klick-händelser till varje filterblock (Renaissance, Romantic osv... ).
function setupFilterBlocks(blockList) {

//loopa igenom alla block vi skickar in i funktionen
  for (const block of blockList) {

    //addera en event listener för klick på varje enskilt block
    block.addEventListener('click', function () {

      // Hämta det värde (t.ex. "Romantic") som ligger i blockets data-period-attribut
      const filter = block.dataset.period;

      // Om blocket redan är aktivt och vi klickar igen → avmarkera det och avsluta funktionen
      if(block.classList.contains('active')) {
        block.classList.remove('active');
        clearArtWorks();
        return; // stoppar funktionen så att ingen filtrering körs
      }
      //om ett annat block var aktivt innan rensa alla "aktive" klasser.
      clearActiveBlocks(block);

      //markera det klickade blocket som aktivt
      block.classList.add('active');

      //kör filtreringen med den valda epoken/kategorin
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
    //console.log(artworkWithImages);

    // returnerar ett begränsat antalal bilder
    return artworkWithImages.slice(0, 40);

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

  const borderContainer = document.getElementById('search-result-container');
  // Om inga resultat hittas – visa meddelande och avbryt funktionen
  if(artworks.length === 0){
    alert("No artworks found.");
    borderContainer.classList.add('hidden-border');
    textResultContainer.textContent = 'No images available for this search!';
    return;
  }

  borderContainer.classList.remove('hidden-border');
  // Visa hur många träffar sökningen gav
  textResultContainer.textContent = `Your search resulted in ${artworks.length} hits:`;

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

  // Hämta konstverken från API baserat på söktexten.
  const artWorks = await fetchArt(searchValue);

  // Visa resultaten genom att rendera dem på sidan
  renderArtWorks(artWorks);
}

 function setupSearchButton(){
   const searchButton = document.getElementById('search-button')
    searchButton.addEventListener('click', () => searchArt());

   const searchInput = document.getElementById('search-bar')
   searchInput.addEventListener('input', function(){
     if(this.value.trim() === ""){ clearArtWorks()}
   });
 }
 setupSearchButton();

function clearArtWorks(){
  const imageResultContainer = document.getElementById('art-results');
  const textResultContainer = document.getElementById('search-result-container');

  imageResultContainer.innerHTML = '';
  textResultContainer.innerHTML = '';

  textResultContainer.classList.add('hidden-border');
}

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
  //console.log(hamburgerMenu, menuList);
});










