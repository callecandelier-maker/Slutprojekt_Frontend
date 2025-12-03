
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




// Ett smidigare och kortare sätt att göra toggle funktionalitet med metoden toggle (DOM)
/*for (let block of blocks) {
  // Lägg till en click-event på varje block
  block.addEventListener('click', function() {

    // Toggle 'active' klassen på blocket och spara om det är aktivt
    const isActive = block.classList.toggle('active');

    // Ta bort 'active' från alla andra block
    clearActiveBlocks(block);

    // Här kan du lägga till annan logik, t.ex. hämta data från API
    // if (isActive) { fetchArtByPeriod(block.dataset.period); }
  });
}
*/

// Notes: Api Fetch etc...
// const respone = await fetch('link to api');

// sätt api länken till en const variabel
//cont url = 'api länk';
/*
async function getData(){
  const response = await fetch(url);
  //kalla på method json, konverterar info till json
  // använd await för att json är också en async operation
   const data = await response.jason()

  console.log(response);
}

//kalla på funktionen
 getData();

*/












/*
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
*/


