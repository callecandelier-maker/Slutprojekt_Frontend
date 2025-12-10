

// -------------------------------------------------------------------------
// HÄMTAR ALLA FILTERBLOCK (bild-blocken: Renaissance, Romantic osv.)
// Dessa används för att styra filtreringen av konst.
// --------------------------------------------------------------------------
const blocks = document.querySelectorAll('.image-block');


// --------------------------------------------------------------------------
// clearActiveBlocks()
// Avmarkerar ALLA aktiva filter-block förutom den som just klickats.
// Används när man klickar på ett nytt filterblock
// --------------------------------------------------------------------------
function clearActiveBlocks(activeBlock) {

  // Loopar igenom alla filter-block
  for (const block of blocks) {

    // Hoppa över blocket som klickades ("activeBlock")
    if (block !== activeBlock) {

      // Om ett block är aktivt ska det avmarkeras
      if (block.classList.contains('active')) {
        block.classList.remove('active');

      }
    }
  }
}


// --------------------------------------------------------------------------
// setupFilterblocks()
// Kopplar klickhändelser till varje filterblock.
// Flöde:
// 1. Användaren klickar på ett block
// 2. Om blocket är aktivt; avmarkera + rensa resultat
// 3. Om blocket INTE är aktivt; rensa tidigare block + markera det nya
// 4. Kör filterArt() för att hämta konst med vald kategori
// --------------------------------------------------------------------------
function setupFilterBlocks(blockList) {

  for (const block of blockList) {

    block.addEventListener('click', function () {

      //  Läs ut filter-namnet från data-period-atributet
      const filter = block.dataset.period;

      // FALL 1: Blocket var aktivt och klickades igen; avmarkera och rensa
      if(block.classList.contains('active')) {
        block.classList.remove('active');
        clearArtWorks(); // Rensa resultat och text
        return; // stoppar - vi ska inte göra en ny API-sökning
      }

      // FALL 2: Ett annat block var aktivt; avmarkera alla andra
      clearActiveBlocks(block);

      // arkera det klickade blocket som aktivt
      block.classList.add('active');

      // Kör filtereringen (API-anrop + rendera)
      filterArt(filter);
    });
  }
}
// Starta filterblocksfunktionens kopplingar
setupFilterBlocks(blocks);

// Tar bort placeholder vid fokus
removePlaceholderText();



// --------------------------------------------------------------------------
// filterArt()
// Fungerar som wrapper: tar emot filterterm; hämtar API-data, renderar
// --------------------------------------------------------------------------
async function filterArt(filterTerm){

  if (!filterTerm) return;

  // Hämta konstverken baserat på filter
  const artworks = await fetchArt(filterTerm);  // samma fetchArt, men skickar filter internt
  renderArtWorks(artworks);
}



// --------------------------------------------------------------------------
// fetchArt()
// Hämtar AIIC-konstverk baserat på sökterm
// Returnerar en lista med max 40 konstverk med bild
// --------------------------------------------------------------------------
async function fetchArt(searchTerm){
 // reternerar en tom lista om det inte finns något argument

  // Om söktermen är tom eller undefined: avbryt hämtningen och returnera en tom lista
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

    // Filtrera bort verk utan bild
    const artworkWithImages = apiResponse.data.filter(art => art.image_id);

    // Returnera de 40 första resultaten
    return artworkWithImages.slice(0, 40);

  }
  // Om vi inte får tillbaka någon data
  catch(error){
    console.error("Error fetching artworks:", error);
    alert("Error fetching image data");
    return [];
  }
}



// --------------------------------------------------------------------------
// renderArtWorks()
// Renderar sökresultat i DOM:en
// Flöde:
// 1. Rensar gamla resultat
// 2. Visar meddelande om inga finns
// 3. Annars visar antal träffar + bilder
// --------------------------------------------------------------------------
function renderArtWorks(artworks) {

  // Hämta referenser till huvudcontainrarna där sökresultat ska visas:
  const imageResultContainer = document.getElementById('art-results');
  const textResultContainer = document.getElementById('search-result-container');

  // Rensa tidigare resultat
  imageResultContainer.innerHTML = '';
  textResultContainer.innerHTML = '';


  // Hämta referens till border element:
  const borderContainer = document.getElementById('search-result-container');

  // Om inga resultat hittades
  if(artworks.length === 0){
    alert("No artworks found.");
    borderContainer.classList.add('hidden-border');
    textResultContainer.textContent = 'No images available for this search!';
    return;
  }


  // Visa border
  borderContainer.classList.remove('hidden-border');

  // Visa antal träffar
  textResultContainer.textContent = `Your search resulted in ${artworks.length} hits:`;

  // Rendera varje bild
  for (let art of artworks) {


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
    // tilldela bilder från api:et
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




// --------------------------------------------------------------------------
// searchArt()
// Hanterar sökfältets manuella sökning (text-input)
// --------------------------------------------------------------------------
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


// --------------------------------------------------------------------------
// setupSearchButton()
// kopplar sökknappen + rensning när inputfältet töms
// Flöde:
// - Klick på knappen; sökning
// - Radera all text; rensa resultaten
// --------------------------------------------------------------------------
 function setupSearchButton(){

   // Hämta sök-knappen och koppla click-event för att starta sökning
   const searchButton = document.getElementById('search-button')
    searchButton.addEventListener('click', () => searchArt());

   // Hämta sökfältet och lyssna på input för att rensa resultat när fältet töms
   const searchInput = document.getElementById('search-bar')
   searchInput.addEventListener('input', function(){
     if(this.value.trim() === ""){ clearArtWorks()}
   });
 }
 // Kör searchfunktionaliteten
 setupSearchButton();



// --------------------------------------------------------------------------
// clearArtWorks()
// Tömmer resultatet + text + tar bort border
// Används när:
// - search-bar töms på text
// - filterBlock avmarkeras
// --------------------------------------------------------------------------
function clearArtWorks(){

  // Hämta containrar för bilder och text
  const imageResultContainer = document.getElementById('art-results');
  const textResultContainer = document.getElementById('search-result-container');

  // Töm tidigare sökresultat
  imageResultContainer.innerHTML = '';
  textResultContainer.innerHTML = '';

  // Dölj textcontainern tills nya resultat visas
  textResultContainer.classList.add('hidden-border');
}



// --------------------------------------------------------------------------
// removePlaceHolderText()
// Gör så att placeholder försvinner vid focus och återkommer vid blur
// --------------------------------------------------------------------------
function removePlaceholderText(){
  // Hämta sökfältet
  let searchInput = document.getElementById('search-bar');

  // När användaren klickar i sökfältet
  searchInput.addEventListener('focus', function(){
    // Spara nuvarande placeholder
    this.dataset.placeholderBackup = this.placeholder;
    // Töm placeholder
    this.placeholder = "";

    // När användaren lämnar fältet
    searchInput.addEventListener('blur', function(){
      // Återställ placeholder om fältet är tomt
      if(this.value === ''){
        this.placeholder = this.dataset.placeholderBackup || 'Search by artist, title....';
      }
    })
  });
}


// --------------------------------------------------------------------------
// HAMBURGERMENYN - togglar visning av dropdown-menyn (ej kopplad till någon mer funktionalitet i nuläget)
// --------------------------------------------------------------------------
const hamburgerMenu = document.getElementById('hamburger-menu');
const menuList = document.getElementById('menu-list');

hamburgerMenu.addEventListener('click', function() {

  if(menuList.classList.contains('hidden')) {
    menuList.classList.remove('hidden'); // Visa menyn
  }else{
    menuList.classList.add('hidden'); // dölj menyn
  }
});



// ---------------------------------------------------------------------------
// Funktionalitet att lägga till i framtiden:
// search-bar ska auto-fyllas när man klickar ett filter
// search-bar ska tömmas när filter avmarkeras
// lägg till keyboard-controls (Enter för sök)
// Addera funktionalitet för hamburgermenyn
// – när man klickar på en kategori ska motsvarande sida eller sektion öppnas
// Exempel på kategorier: "Spara konst", "About", "Kontakt" osv.
// ---------------------------------------------------------------------------




