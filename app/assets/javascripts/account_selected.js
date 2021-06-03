const form = document.querySelector("form#select-accounts-form")

form.addEventListener("submit", function() {

  const accountSelected = document.querySelector("#account")
  event.preventDefault();
  document.querySelector("div#account-show") ? null : fetchAccount(accountSelected.value);
  
  function fetchAccount(accountId) {
    const data = { accountId: accountId }
    fetch(`http://localhost:3000/accounts/select`,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(data)
    })
    .then(resp => resp.json())
    .then(json => showAccountDetails(json))
  }

  function showAccountDetails(json) {
    const h1Name = document.createElement("h1");
    const accountShow = document.querySelector("div#account-show");
    const oppTable = document.querySelector("table#opportunities-table");
    const accountShowTemplate = document.querySelector("template#account-show");
    const accountSelectDiv = document.querySelector("div#account-select");
    
    if (accountShow) {
      removeAccountDetails(accountShow);
    }

    newDiv = accountShowTemplate.content.firstElementChild.cloneNode(true);
    newDiv.id = "account-show"
    accountSelectDiv.insertAdjacentElement("beforeend", newDiv);

    showOpportunities(json);
  }

  function AccountFields() {
  }

  function removeAccountDetails(element) {
    while (element.lastElementChild) {
      element.lastElementChild.remove();
    }
  }

  function showOpportunities(json) {
    const opportunities = json.included
    const table = document.querySelector("table#opportunities-table");

    for (const opp of opportunities) {
      let tr = document.createElement("tr");
      tr.innerHTML = `
      <td>
        <div class="flex" id="opp-buttons">
          <div class='cursor-pointer'>&#10060</div>
          <div>&#9749</div>
          <div>&#9728</div>
        </div>
      </td>
      <td class='text-xs' id='${opp.id}'><span class='cursor-pointer' id='opp-description'>${opp.attributes.description}</span></td>
      <td class='text-sm text-center'>${opp.attributes.close_date}</td>
      `

      table.insertAdjacentElement("beforeend", tr);

      addListenersForOppButtons(tr);
    }

    function addListenersForOppButtons(tr) {
      buttonsDiv = tr.querySelector("div#opp-buttons")
      oppDescription = tr.querySelector("span#opp-description");

      buttonsDiv.children[0].addEventListener("click", function(){
        if (confirm("Are you sure you want to delete this opportunity?")) {
          // add code with fetch to delete that opportunity
          event.target.parentElement.parentElement.parentElement.remove();
        }
      })

      oppDescription.addEventListener("click", function() {
        showOpportunitySide(oppDescription.parentElement.id);
      })

      // add other listeners

      function showOpportunitySide(id) {
        fetchOpportunity(id);
      }

      function fetchOpportunity(id) {
        fetch(`http://localhost:3000/opportunities/${id}`)
        .then(resp => resp.json())
        .then(json => displayOpportunitySide(json))
      }

      function displayOpportunitySide(json) {
        const oppSideTemplate = document.querySelector("template#opportunity-side-window");
        const accountSelect = document.querySelector("div#account-select")
        const oppSideDiv = oppSideTemplate.content.firstElementChild.cloneNode(true);
        oppSideDiv.id = "opportunity-side-window"

        if (!document.querySelector("div#opportunity-side-window")) {
          accountSelect.insertAdjacentElement("afterend", oppSideDiv);

          const opportunitySideDiv = document.querySelector("div#opportunity-side-window");

          opportunitySideDiv.querySelector("textarea#opp-side-desc").value = json.data.attributes.description;
          opportunitySideDiv.querySelector("input#opp-side-close-date").value = json.data.attributes.close_date;

          const oppTasksOpen = document.querySelector("div#opportunity-tasks-open");
          const oppTasksCompleted = document.querySelector("div#opportunity-tasks-completed")
          
          for (const task of json.included) {
            let tr = document.createElement("tr")
            tr.innerHTML = `
              <td>
                <div class="flex space-x-1">
                  <div class="cursor-pointer">&#10003;</div>
                  <div class="cursor-pointer">&#128203;</div>
                </div>
              </td>
              <td class="text-xs w-3/12 pl-3">${task.attributes.description}</td>
              <td class="text-center text-xs w-3/12">${task.attributes.task_type}</td>
              <td class="text-center text-xs w-3/12">${task.attributes.task_subtype}</td>
              <td><input type='date' class='mx-auto text-xs w-28' value='${task.attributes.due_date}' </td>
            `

            if (task.attributes.status === "open") {
              oppTasksOpen.firstElementChild.appendChild(tr);
            } else {
              tr.innerHTML = `
                <td>
                  <div class="flex space-x-1">
                    <div class="cursor-pointer">&#10003;</div>
                  </div>
                <td class="text-xs w-3/12 pl-3">${task.attributes.description}</td>
                <td class="text-center text-xs w-3/12">${task.attributes.task_type}</td>
                <td class="text-center text-xs w-3/12">${task.attributes.task_subtype}</td>
                <td><input type='date' class='mx-auto text-xs w-28' value='${task.attributes.due_date}' </td>
              `
              oppTasksCompleted.firstElementChild.appendChild(tr);
              addOpportunitySideBarListeners();
            }
          }
          function addOpportunitySideBarListeners() {
            const opportunitySideDiv = document.querySelector("div#opportunity-side-window");
  
            opportunitySideDiv.querySelector("#side-window-close").addEventListener("click", function() {
              
              opportunitySideDiv.remove();
            })

          }
        }
      }
    }
  }
});
