const choices = ["Mleko", "Miód", "Orzechy arachidowe", "Olej kokosowy"];
document.addEventListener('DOMContentLoaded', function () {
  function goToInput() {
    chosenSearchInput.focus();
  }
  
  
  const chosenContainer = document.querySelector("#chosen-container");
  const chosenSearchInput = document.getElementById("chosen-search-input");
  const chosenResults = document.getElementById("chosen-results");
  const chosenChoices = document.getElementById("chosen-choices");
  const form = document.getElementById("form");
  let currentString;
  let choicesAry = [];

  chosenSearchInput.addEventListener('input', e => {
    currentString = e.target.value;
  });

  //focus on input when click on container
  chosenContainer.addEventListener("click", goToInput);
  //get components list via ajax
  chosenSearchInput.addEventListener("keyup", getComponents);
  //remove choice from choices list
  chosenSearchInput.addEventListener("keydown", removeLastChoice);
  //prevent submiting form by pressing enter key
  form.addEventListener("keydown", preventEnter);



  function getComponents() {
    //hardcoded data for test, actual code is below
    fillDropdown();
    return;
    //
    //
    //input value must be at least one legal character length
    if(this.value.length == 0 || this.value == " ") {
      chosenResults.innerHTML = "";
      return;
    }
    
    // axios.post(`ajax?namepart=${this.value}`)
    // .then(response => {
    //   if(response.statusCode === 200) {
    //     return response.data;
    //   }

    //   throw 
    // })
    // .then(json => {
    //   ...addToResult(json);
    // })
    // .catch(e => {
    //   alert(e.message);
    // });

    // Promise,
    // Async await
  }

  function fillDropdown() {
    chosenResults.innerHTML = "";
    let nodeElements = '';
    for(var item of choices) {
      //check if item is already chosed
      if(choicesAry.includes(item)) 
        continue;

      nodeElements += `
        <li>${item}</li>
      `;
    }
    chosenResults.innerHTML = nodeElements;

    Array.from(chosenResults.children).forEach(li => {
      li.addEventListener('click', () => addToChoices(li.innerHTML));
    })
  }

  //add item to chosen items in multiselect input
  function addToChoices(str) { 
    var i = document.createElement("i");
    i.setAttribute("class", "material-icons");
    //add removing function handler
    i.setAttribute("onclick", "removeChoice(this.parentNode)");
    i.appendChild(document.createTextNode("clear"));

    var span = document.createElement("span");
    span.appendChild(document.createTextNode(str));

    var li = document.createElement("li");
    li.setAttribute("class", "search-choice");
    li.appendChild(span);
    li.appendChild(i);

    var numNodes = chosenChoices.children.length;
    chosenChoices.insertBefore(li, chosenChoices.children[numNodes - 1]);
    chosenSearchInput.value = "";
    chosenResults.innerHTML = "";
    choicesAry.push(str);
    goToInput();
  }

  //remove item from choices
  function removeChoice(choice) {
    var elemString = choice.childNodes[0].innerHTML;
    choicesAry.splice(choicesAry.indexOf(elemString), 1);
    choice.parentNode.removeChild(choice);
  }

  //remove last choice in the case when user press backspace in empty text input
  function removeLastChoice(e) {
    if(this.value.length == 0 && e.key == "Backspace" && choicesAry.length > 0) {
      choicesAry.pop();
      chosenChoices.removeChild(chosenChoices.children[chosenChoices.children.length - 2]);
    }
  }


  function preventEnter(e) {
    if(e.key == "Enter") {
      e.preventDefault();
    }
  }

});
