/** Multiselect input with autocomplete functionality class */
class MultiselectAutocomplete {
  
  /**
    * Create a multiselect input component with autocomplete functionality
    */
  constructor() {
    this.buildStructure();
    this.setEvents();
    this.highlightedDropdownItem = null;
  }

  /**
   * Build component structure
   */
  buildStructure() {
    this.component = document.querySelector('.multiselect-autocomplete');
    this.inputArea = document.createElement('div');
    this.selectedItems = document.createElement('ul');
    this.textInput = document.createElement('input');
    this.dropdown = document.createElement('div');
    this.dropdownItems = document.createElement('ul');
    
    this.inputArea.classList.add('multiselect-autocomplete-input');
    this.selectedItems.classList.add('multiselect-autocomplete-selected-items');
    this.textInput.classList.add('multiselect-autocomplete-text-input');
    this.textInput.type = 'text';
    this.textInput.autocomplete = 'off';
    this.dropdown.classList.add('multiselect-autocomplete-dropdown');
    this.dropdownItems.classList.add('multiselect-autocomplete-dropdown-items');
    
    this.inputArea.appendChild(this.selectedItems);
    this.inputArea.appendChild(this.textInput);
    this.dropdown.appendChild(this.dropdownItems);
    this.component.appendChild(this.inputArea);
    this.component.appendChild(this.dropdown);
  }

  /**
   * Set events for top level elements
   */
  setEvents() {
    this.inputArea.addEventListener('click', this.focusOnTextInput);
    this.textInput.addEventListener('input', this.inputTextChanged);
  }

  /**
   * Set focus on text input element
   */
  focusOnTextInput() {
    this.textInput.focus();
  }

  /**
   * Text input valie has changed
   * @param {*} event 
   */
  inputTextChanged(event) {
    if(!event.target.value == '') {
      this.requestItems(event.target.value);
    } else {
      this.dropdownItems.innerHTML = '';
      this.highlightedDropdownItem = null;
    }
  }

  requestItems(inputString) {
    const requestAddress = `https://pmalicki.com/alergens/products/ajax?namepart=${inputString}`;
    fetch(requestAddress)
    .then((response) => response.json())
    .then((data) => {
      generateMultiselectDropdownList(data);
    })
    .catch((error) =>  this.dropdownItems.innerHTML ='<li>Nothing found</li>');
    this.dropdownItems.innerHTML ='<li>Searching...</li>'
  }

}


document.addEventListener('DOMContentLoaded', function() {
  const multiselectAutocomplete = new MultiselectAutocomplete();
});