const form = document.querySelector("form#select-accounts-form")

form.addEventListener("submit", function() {

  const accountSelected = document.querySelector("#account")
  event.preventDefault();
  selectdisplayElements();
  fetchAccount(accountSelected.value);

  function selectdisplayElements() {
  
    const div = document.querySelector("div#account-show");
    const h1 = div.children[0];
  }
  
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
    removeAccountDetails(accountShow);

    h1Name.innerText = json.name;
    accountShow.appendChild(h1Name);
  }

  function removeAccountDetails(element) {
    while (element.lastElementChild) {
      element.lastElementChild.remove();
    }
  }
});
