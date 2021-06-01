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

      oppDescription.addEventListener("click", showOpportunitySide(oppDescription.parentElement.id))

      // add other listeners

      function showOpportunitySide(id) {
        fetchOpportunity(id);
      }

      function fetchOpportunity(id) {
        fetch(`http://localhost:3000/opportunities/${id}`)
        .then(resp => resp.json())
        .then(json => showAccountDetails(json))
      }
    }
  }
});
