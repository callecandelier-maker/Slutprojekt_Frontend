// Hämta alla image-blocks
/*
const blocks = document.querySelectorAll('.image-block');

// Lägg till click-event
blocks.forEach(block => {
  block.addEventListener('click', () => {
    // Lägg till/tar bort active-klassen
    block.classList.toggle('active');
  });
});
*/


//alternativ kod för att klicka ur föregående objekt när man klickar i nästa
// Hämta alla image-blocks
// Hämta alla image-blocks
const blocks = document.querySelectorAll('.image-block');

// Funktion för att rensa active-klasser från alla block utom det klickade
function clearActiveBlocks(except) {
  blocks.forEach(block => {
    if (block !== except) {
      if (block.classList.contains('active')) {
        block.classList.remove('active');
      }
    }
  });
}

// Lägg till click-event på varje block
blocks.forEach(block => {
  block.addEventListener('click', () => {

    // Kolla om blocket redan är aktivt
    let isActive = false;
    if (block.classList.contains('active')) {
      // Om blocket är aktivt, ta bort active
      block.classList.remove('active');
      isActive = false;
    } else {
      // Om blocket inte är aktivt, lägg till active
      block.classList.add('active');
      isActive = true;
    }

    // Rensa active från alla andra block
    clearActiveBlocks(block);

    // Här kan du lägga till logik för API-anrop
    if (isActive) {
      console.log("Block aktiverat: " + block.dataset.period);
      // fetchArtByPeriod(block.dataset.period);
    } else {
      console.log("Block avaktiverat: " + block.dataset.period);
      // document.getElementById('art-results').innerHTML = "";
    }

  });
});



/*
//kod som ska studeras
// Hämta alla image-blocks
const blocks = document.querySelectorAll('.image-block');
const container = document.getElementById('art-results');
const searchInput = document.querySelector('.search-bar');
const searchButton = document.querySelector('.search-button');

// Funktion för att rensa active-klasser från alla block utom det klickade
function clearActiveBlocks(except) {
  blocks.forEach(block => {
    if (block !== except) {
      block.classList.remove('active');
    }
  });
}

// Klick på period-block
blocks.forEach(block => {
  block.addEventListener('click', () => {
    const isActive = block.classList.toggle('active');
    clearActiveBlocks(block);

    // Rensa sökfält
    searchInput.value = '';

    if (isActive) {
      fetchArtByQuery(block.dataset.period);
    } else {
      container.innerHTML = '';
    }
  });
});

// Klick på search-button
searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (!query) return;

  // Rensa active-blocks när man söker
  clearActiveBlocks(null);

  fetchArtByQuery(query);
});

// Enter i search input
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchButton.click();
  }
});

// Funktion för att hämta konstverk från Met Museum API
async function fetchArtByQuery(query) {
  container.innerHTML = '<p>Loading...</p>';

  try {
    const searchRes = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(query)}`);
    const searchData = await searchRes.json();

    if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
      container.innerHTML = '<p>No artworks found.</p>';
      return;
    }

    container.innerHTML = ''; // Rensa tidigare resultat
    const ids = searchData.objectIDs.slice(0, 6); // max 6 verk

    for (const id of ids) {
      try {
        const artRes = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
        const art = await artRes.json();

        if (!art.primaryImage) continue;

        const div = document.createElement('div');
        div.className = 'art-result-block';
        div.innerHTML = `
          <img src="${art.primaryImage}" alt="${art.title}">
          <p>${art.title}</p>
        `;

        container.appendChild(div);
      } catch (err) {
        console.warn('Failed to load artwork with ID', id);
      }
    }

    if (container.children.length === 0) {
      container.innerHTML = '<p>No artworks found.</p>';
    }

  } catch (error) {
    console.error('Error fetching artworks:', error);
    container.innerHTML = '<p>Failed to load artworks.</p>';
  }
}
*/
