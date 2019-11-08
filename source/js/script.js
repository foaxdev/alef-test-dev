'use strict';

(() => {
  let toggleButton = document.querySelector('.toggle');
  let menu = document.querySelector('.menu');

  toggleButton.addEventListener('click', () => {
    menu.classList.toggle('in');
  });
})();
