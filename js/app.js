
// Hämta alla image-blocks i html
const blocks = document.querySelectorAll('.image-block');



// clearActiveBlocks funktionen som vi kallar på i for-lopen
// för som kollar av aktivitet för click image blocks

function clearActiveBlocks(activeBlock) {

  // En for loop som Loopar igenom alla block i samlingen.
  //( )Note to self man skriver of blocks i javascript)
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

// En ytterligare for-loop där vi skapar funktionalitet för hur vi aktiverar blocken
for (let block of blocks) {
  //lägg till en eventListener på varje block
  block.addEventListener('click', function(){


    let isActive = false;
    if(block.classList.contains('active')) {
      //om blocket är activt, ta bort active
      block.classList.remove('active');
    }
    else{
      //om blocket inte är aktivt lägg till active
      block.classList.add('active');
      isActive = true;
    }
    clearActiveBlocks(block);

  } );
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


//funktionalitet för search

const btn = document.getElementById('search-button');
btn.addEventListener('click', fetchArt);

async function fetchArt() {
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







