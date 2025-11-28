// Hämta alla image-blocks
const blocks = document.querySelectorAll('.image-block');

// Lägg till click-event
blocks.forEach(block => {
  block.addEventListener('click', () => {
    // Lägg till/tar bort active-klassen
    block.classList.toggle('active');
  });
});
