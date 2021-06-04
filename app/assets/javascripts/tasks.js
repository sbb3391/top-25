const filterButton = document.querySelector(".new-task")

filterButton.addEventListener("click", function() {
  showGreyBackground();
  showTaskForm();
})

function showGreyBackground() {
  const formBackground = document.querySelector("div#form-background");
  const mainPage = document.querySelector("div#main-page");

  formBackground.classList.remove("hidden");
  mainPage.classList.add("filter", "blur-md");
}

function showTaskForm() {
  const grayBackground = document.querySelector("div#gray-background");
  const formBackground = document.querySelector("div#form-background")
  const taskFormTemplate = document.querySelector("template#new-task-form");
  const taskForm = taskFormTemplate.content.firstElementChild.cloneNode(true);
  const mainPage = document.querySelector("div#main-page");

  grayBackground.appendChild(taskForm);

  formBackground.addEventListener("click", function() {
    if (event.target === formBackground) {
      while (grayBackground.lastElementChild) {
        grayBackground.lastElementChild.remove();
      }
  
      formBackground.classList.add("hidden");
      mainPage.classList.remove("filter", "blur-md");
    }
  })
}