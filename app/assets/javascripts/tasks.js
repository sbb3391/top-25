const newTaskButton = document.querySelector(".new-task")
const taskTypes = {
  "Customer Service": [
    "Toner", "Billing", "Form Filling"
  ],
  "Orders": [
    "Order Entry", "Order Fix"
  ],
  "Prospecting": [
    "Follow Up", "Call", "Email"
  ],
  "Meeting": [
    "Account Review", "First In", "In House Demo", "Proposal"
  ],
  "Current Customer": [
    "Follow Up", "Call", "Email"
  ]
}

newTaskButton.addEventListener("click", function() {
  showGreyBackground();
  showTaskForm();
  populateTaskForm();
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
  taskForm.id = "task-form"
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

function populateTaskForm() {
  const taskForm = document.querySelector("div#task-form");
  const startDate = taskForm.querySelector("#task-start-date");
  const dueDate = taskForm.querySelector("#task-due-date");
  const taskType = taskForm.querySelector("#task-type");
  const taskSubtype = taskForm.querySelector("#task-sub-type");
  const accounts = taskForm.querySelector("#task-accounts");
  let options = { year: "numeric", month: "2-digit", day: "2-digit"}

  startDate.value = stringDate();
  dueDate.value = stringDate();
  getTaskTypes(taskTypes, taskType);
  taskType.addEventListener("change", function() {
    getSubtaskTypes(event, taskSubtype);
  });
  accounts.addEventListener("change", function() {
    handleAccountSelection(event, accounts);
  })


}

function stringDate() {
  date = new Date();
  y = date.getFullYear();
  m = date.getMonth();
  d = date.getDate();

  dateString = y + "-" + (m <=9 ? "0" + (m + 1) : (m + 1)) + "-" + (d <=9 ? "0" + d : d);
  return dateString;
}

function getTaskTypes(obj, ele) {
  const keys = Object.keys(obj);
  let option;

  for (const key of keys) {
    option = document.createElement("option");
    option.setAttribute("value", key)
    option.appendChild(document.createTextNode(key))
    ele.appendChild(option);
  }
}

function getSubtaskTypes(e, ele) {
  const target = e.target;
  const subTypeValues = taskTypes[target.value]
  let option;

  // remove all subtype options for select box
  while (ele.lastElementChild) {
    ele.lastElementChild.remove();
  }

  for (const value of subTypeValues) {
    option = document.createElement("option");
    option.setAttribute("value", value);
    option.appendChild(document.createTextNode(value));
    ele.appendChild(option);
  }

  ele.removeAttribute("disabled");
}

function handleAccountSelection(e, ele) {
  const target = e.target;

  const selectedOptionId = ele.children[target.selectedIndex].dataset.id;

  fetchAccount(selectedOptionId)

  function fetchAccount(id) {
    fetch(`http://localhost:3000/accounts/${selectedOptionId}`)
    .then(resp => resp.json())
    .then(json => addOpportunitiesForAccount(json))
  }

  function addOpportunitiesForAccount(json) {
    const opportunities = json.included
    const selectOpportunities = document.querySelector("select#account-opportunities");

    while (selectOpportunities.lastElementChild) {
      selectOpportunities.lastElementChild.remove();
    }

    let emptyOption = document.createElement("option");
    emptyOption.value =  "-- select an option --";
    emptyOption.innerText =  "-- select an option --"; 
    selectOpportunities.appendChild(emptyOption); 

    for (const opp of opportunities) {
      let description = opp.attributes.description
      let newOption = document.createElement("option")
      newOption.setAttribute("data-id", opp.id)
      newOption.appendChild(document.createTextNode(description));
      selectOpportunities.appendChild(newOption);

    }
  }
}