const button = document.querySelector('#theme-toggle')

button.addEventListener('click', function () {
  document.body.classList.toggle('dark-mode')
  button.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙'
})
