const filterButton = document.querySelector(".filter-accounts")

filterButton.addEventListener("click", function() {
  showGreyBackground();
})

function showGreyBackground() {
  const BackgroundTemplate = document.querySelector("template#grey-background");

  const background = BackgroundTemplate.content.firstElementChild.cloneNode(true);

  document.querySelector("div#main").insertAdjacentElement("afterbegin", background);
}