if (localStorage.theme) {
  Array.from(themeSelector.children).find(e => e.value === localStorage.theme).setAttribute('selected', '');
}
themeSelector.addEventListener('click', e => {
  let old = localStorage.theme;
  localStorage.theme = themeSelector.value;
  if (old !== themeSelector.value) location.reload()
});