// Allows the user to toggle between 'light' mode and 'dark' mode

const button = document.querySelector('#theme-toggle');

button.addEventListener('click', function() {
  document.body.classList.toggle('dark');
  button.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
})