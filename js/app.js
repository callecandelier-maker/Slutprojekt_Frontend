const wrappers = document.querySelectorAll('.image-wrapper');

// Lägg in bilder via CSS-variabel
wrappers.forEach(div => {
  div.style.setProperty('--img', `url(${div.dataset.img})`);
});

// Toggle active state vid klick
wrappers.forEach(div => {
  div.addEventListener('click', () => {
    div.classList.toggle('active'); // Klick → låser/återställer
  });
});
