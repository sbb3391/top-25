
// New Task Actions
const newTaskButton = document.querySelector(".new-task")
const taskTypes = {
  "Customer Service": [
    "Toner", "Billing", "Form Filling"
  ],
  "Orders": [
    "Order Entry", "Order Fix"
  ],
  "Prospecting": [
    "Prospecting Follow Up", "Prospecting Call", "Prospecting Email"
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
  fetchSessionTaskFilter();
  populateTaskForm();
  // handleNewTaskFormSubmission();
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
  const opportunities = taskForm.querySelector("#account-opportunities")

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
  opportunities.addEventListener("change", function() {
    handleOpportunitySelection(event, opportunities)
  })


}

function stringDate(dateArg) {
  const date = new Date(dateArg);
  y = date.getFullYear();
  m = date.getMonth();
  d = date.getDate();

  dateString = y + "-" + (m <=9 ? "0" + (m + 1) : (m + 1)) + "-" + (d <=9 ? "0" + d : d);
  return dateString;
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
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
  const selectedOptionId = ele.children[target.selectedIndex].value;
  
  // remove dataset id from select element if one exists, then add the new one
  ele.dataset.id ? ele.removeAttribute("data-id") : null
  ele.setAttribute("data-id", selectedOptionId);

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
    selectOpportunities.removeAttribute("disabled");
  }
}

function handleOpportunitySelection(e, ele) {
  const target = e.target;
  const selectedOptionId = ele.children[target.selectedIndex].dataset.id

    // remove dataset id from select element if one exists, then add the new one
    ele.dataset.id ? ele.removeAttribute("data-id") : null
    ele.setAttribute("data-id", selectedOptionId);
}

// Filter Task Actions
const FilterTasksButton = document.querySelector(".filter-tasks")

FilterTasksButton.addEventListener("click", function() {
  showGreyBackground();
  showFilterTasksForm();
  fetchSessionTaskFilter();
  addListenersForSubtypeInputs();
  addListenerToResetTaskFilterSession();
  // populateFilterTasksForm();
  // handleNewTaskFormSubmission();
})

function showFilterTasksForm() {
  const grayBackground = document.querySelector("div#gray-background");
  const formBackground = document.querySelector("div#form-background");
  const filterFormTemplate = document.querySelector("template#filter-tasks-form");
  const filterForm = filterFormTemplate.content.firstElementChild.cloneNode(true);
  filterForm.id = "tasks-filter-form"
  const mainPage = document.querySelector("div#main-page");

  grayBackground.appendChild(filterForm);

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

function fetchSessionTaskFilter() {
  fetch("http://localhost:3000/tasks/filter_check")
  .then(resp => resp.json())
  .then(json => populateTaskFilterForm(json))
}

function populateTaskFilterForm(json) {
  if (json["json"]) {
    populateFilterTasksFormStandard();
  } else {
    populateFilterTasksFormFromSession(json);
  }
}

function populateFilterTasksFormStandard() {
  // populate task-type filters
  formatInputDates();
  addTypeAndSubtypeInputs();
  addListenersForTypeInputs();
  addListenersForSubtypeInputs();
  addListenersForExpansionIcons();
  submitTaskFilterForm();
}

function populateFilterTasksFormFromSession(json) {
  formatInputDates();
  populateDateFilterFromSession(json);
  addTypeAndSubtypeInputs();
  addListenersForTypeInputs();
  addListenersForSubtypeInputs();
  addListenersForExpansionIcons();
  populatesubtypesFiltersFromSession(json);
  checkTypesInputsAfterSubtypeChange();
  populateOtherFiltersFromSession(json);
  submitTaskFilterForm();

}

function populateDateFilterFromSession(json) {
  const dateFilterKeys = Object.keys(json["dateFilter"])
  
  for (const dateFilter of dateFilterKeys) {
    const span = document.querySelector(`span#${dateFilter}`);
    span.nextElementSibling.value = json["dateFilter"][dateFilter];
    span.previousElementSibling.type === "radio" ? span.previousElementSibling.checked = true : null
  }
}

function populatesubtypesFiltersFromSession(json) {
  const sessionSubtypeFilters = json["subtypeFilters"];
  // uncheck all subtypes
  const subtypeInputs =  document.querySelectorAll("input.subtype-input");
  for (const input of subtypeInputs) {
    input.checked = false;
  }

  // check all inputs that are included from the session
  for (const subtype of sessionSubtypeFilters) {
    let label = document.querySelector(`label[data-subtype='${subtype}']`);
    label.previousElementSibling.checked = true;
  }
}

function populateOtherFiltersFromSession(json) {

}

function checkTypesInputsAfterSubtypeChange() {
  const taskTypeInputs = document.querySelectorAll("input.type-input")
  let counter = 0

  // iterate over all subtype filters for each type filter
  for (const input of taskTypeInputs) {
    let subtypes = input.parentNode.nextElementSibling.children

    for (const li of subtypes) {
      li.firstElementChild.checked? counter += 1 : null
    }

    if (counter === 0) {
      input.checked = false;
    } else if (counter > 0 && counter < subtypes.length) {
      input.indeterminate = true;
    } else {
      input.checked = true;
    }
    counter = 0
  }
}

function addTypeAndSubtypeInputs() {
  const TaskTypeKeys = Object.keys(taskTypes);
  const taskTypesUl = document.querySelector("ul#task-types-ul");

  for (const key of TaskTypeKeys) {
    let taskTypeLi = document.createElement("li");
    taskTypeLi.className += "text-sm space-y-1"
    taskTypeLi.innerHTML = `
      <div class="flex space-x-3">
        <span class="collapse cursor-pointer">&#x25B2;</span>
        <input type='checkbox' class="type-input align-self-end" checked='true'>
        <label>${key}</label>
      </div>
      <ul class='task-subtypes-ul pl-9 text-xs space-y-1' hidden="true"></ul>
    `
    taskTypesUl.appendChild(taskTypeLi);
    

    let allSubtypeUls = document.querySelectorAll("ul.task-subtypes-ul");

    let subtypesOfThisTaskType = taskTypes[key];

    for (const subtype of subtypesOfThisTaskType) {
      let SubtypeUlforThisTaskType = allSubtypeUls[allSubtypeUls.length - 1];
      let subtaskTypeLi = document.createElement("li");
      subtaskTypeLi.innerHTML = `
        <input type="checkbox" checked="true" class="subtype-input">
        <label data-subtype='${subtype}'>${subtype}</label>
      `

      SubtypeUlforThisTaskType.appendChild(subtaskTypeLi);
    }
  }
}

function addListenersForTypeInputs() {
  const typeInputs = document.querySelectorAll("input.type-input")

  for (const typeInput of typeInputs) {
    typeInput.addEventListener("change", toggleSubtypesChecked);
  }
}

function toggleSubtypesChecked(e) {
  let childLis = e.target.parentNode.nextElementSibling.children;
  let checked = e.target.checked;

  for (const li of childLis) {
    let input = li.querySelector("input");
    checked === true ? input.checked = true : input.checked = false
  }
}

function addListenersForSubtypeInputs () {
  const subtypeInputs = document.querySelectorAll("input.subtype-input");

  for (const subtype of subtypeInputs) {
    subtype.addEventListener("change", updateTypeInputValue)
  }
}

function updateTypeInputValue(e) {
  const parentUl = e.target.parentNode.parentNode
  const parentTypeInput = parentUl.parentNode.querySelector("input");
  let counter = 0

  for (const li of parentUl.children) {
    li.querySelector("input").checked ? counter += 1 : null
  }


  if (counter === 0) {
    parentTypeInput.checked = false;
  } else if (counter > 0 && counter < parentUl.children.length) {
    parentTypeInput.indeterminate = true;
  } else {
    parentTypeInput.checked = true;
    parentTypeInput.indeterminate = false;
  }
}

function addListenersForExpansionIcons() {
  const expansionIcons = document.querySelectorAll("span.collapse")

  for (const span of expansionIcons) {
    span.addEventListener("click", showOrHideSubtypes)
  }
}

function showOrHideSubtypes(e) {
  const subtypeUlForThisIcon = e.target.parentNode.nextElementSibling;

  subtypeUlForThisIcon.hidden ? subtypeUlForThisIcon.hidden = false : subtypeUlForThisIcon.hidden = true;

}

function formatInputDates() {
  const dateInputs = document.querySelector("div#task-date-filters").querySelectorAll("input[type='date']");
  
  for (const input of dateInputs) {
    let span = input.previousElementSibling;

    if (span.id === "due-on" || span.id === "due-before") {
      input.value = stringDate(new Date);
    } else if (span.id === "due-between-1") {
      input.value = stringDate(addDays(new Date, -2));
    } else if (span.id === "due-between-2") {
      input.value = stringDate(addDays(new Date, 3))
    }
  }
}

function submitTaskFilterForm() {
  const filterTasksForm = document.querySelector("form#filter-tasks-form")

  filterTasksForm.addEventListener("submit", function() {
    
    fetchFilterTasks(event);
    closeForm();
  })
}

function fetchFilterTasks(event) {
  event.preventDefault();

  const token = document.getElementsByName('csrf-token')[0].content;
  const options = {
    method: "POST",
    body: JSON.stringify(taskFilterFormBodyInfo()),
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'X-CSRF-Token': token
    }
  }
  fetch("http://localhost:3000/tasks/filter_session", options)
  .then(resp => resp.json())
  .then(function(data) {
    populateFilterResults(data);
  })
}

function taskFilterFormBodyInfo() {
  let bodyObject = {
    dateFilter: {},
    subtypeFilters: [],
    otherFilters: []
  };

  populateDateFilterKey(bodyObject);
  populateSubtypeFiltersKey(bodyObject);
  populateOtherFiltersKey(bodyObject);

  return bodyObject;
}

function populateDateFilterKey(bodyObject) {
  const dateFilterRadioButtons = document.querySelector("div#task-date-filters").querySelectorAll("input[type='radio']");
    
  for (const dateFilterRadio of dateFilterRadioButtons) {
    let inputs = dateFilterRadio.parentNode.querySelectorAll("input[type='date']");

    if (dateFilterRadio.checked) {
      for (const input of inputs) {
        bodyObject["dateFilter"][input.previousElementSibling.id] = input.value;
      }
    }
  }
}

function populateSubtypeFiltersKey(bodyObject) {
  const subtypeUls = document.querySelectorAll("ul.task-subtypes-ul");
  
  for (const ul of subtypeUls) {
    let parentInput = ul.previousElementSibling.children[1]

    if (!parentInput.checked) {
      null
    } else {
      for (const li of ul.children) {
        if (li.firstElementChild.checked) {
          bodyObject["subtypeFilters"].push(li.lastElementChild.textContent)
        }
      }
    }
  }
}

function populateOtherFiltersKey(bodyObject) {
  const otherFiltersInputs = document.querySelector("div#other-filters").querySelectorAll("input");
  
  for (const other of otherFiltersInputs) {
    if (other.checked) {
      bodyObject["otherFilters"].push(other.nextElementSibling.textContent);
    }
  }
}
  
function closeForm() {
  const grayBackground = document.querySelector("div#gray-background");
  const formBackground = document.querySelector("div#form-background");
  const mainPage = document.querySelector("div#main-page");

  while (grayBackground.lastElementChild) {
    grayBackground.lastElementChild.remove();
  }

  formBackground.classList.add("hidden");
  mainPage.classList.remove("filter", "blur-md");
}
 
function addListenerToResetTaskFilterSession() {
  const resetButton = document.querySelector("button#reset-task-filter");

  resetButton.addEventListener("click", function() {
    fetchResetTaskFilterSession(event);
    closeForm();
    showGreyBackground();
    showFilterTasksForm();
    populateFilterTasksFormStandard();
    addListenersForSubtypeInputs();
    addListenerToResetTaskFilterSession();
  }) 
}

function fetchResetTaskFilterSession(event) {
  event.preventDefault();
  
  fetch("http://localhost:3000/tasks/remove_filter")
  .then(resp => resp.json())
  .then(json => console.log(json))
}

function populateFilterResults(json) {
  
}

// function handleNewTaskFormSubmission() {
//   const newTaskFormElement = document.querySelector("div#task-form").querySelector("form");
  
//   newTaskFormElement.addEventListener("submit", taskFormSubmit)
// }

// function taskFormSubmit() {
//   event.preventDefault();
//   postTaskForm(taskFormBodyInfo());
// }

// function postTaskForm(bodyOptions) {
  // const token = document.getElementsByName('csrf-token')[0].content;
  // const options = {
  //   method: "POST",
  //   body: JSON.stringify(bodyOptions),
  //   headers: {
  //     'Accept': 'application/json',
  //     "Content-type": "application/json",
  //     "X-CSRF-Token": token
  //   }
  // }
  // fetch("http://localhost:3000/tasks", options)
  // .then(resp => resp.json())
  // .then(json => console.log(json))
// }

// function taskFormBodyInfo() {
//   const bodyOptions = document.querySelector("div#task-form").querySelectorAll(".body-option")
//   let bodyObject = {
//     task: {

//     }
//   }
//   for (const option of bodyOptions) {
//     if (option.dataset.id) {
//       bodyObject[option.name] = option.dataset.id;
//     } else {
//       bodyObject[option.name] = option.value;
//     }
//   }
//   return bodyObject;
// }

// SEARCH FORM - FROM HANNAH
// const searchForm = document.querySelector("div#search-form")

// searchForm.addEventListener("submit", event => {
//   event.preventDefault();
//   fetchSearch(event);
// });

// function fetchSearch(e) {
//   const inputValue = e.target.children[0].value
//   const token = document.getElementsByName('csrf-token')[0].content;
//   const baseUrl = "http://localhost:3000/tasks"
//   const options = {
//     method: "POST",
//     body: JSON.stringify({
//       search: inputValue
//     }),
//     headers: {
//       'Accept': 'application/json',
//       "Content-type": "application/json",
//       "X-CSRF-Token": token
//     }
//   }
  
//   fetch(baseUrl + "/search", options)
//   .then(resp => resp.json())
//   .then(json => console.log(json))

// }