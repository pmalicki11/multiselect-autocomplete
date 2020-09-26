const requestURL = 'https://pmalicki.com/alergens/products/ajax?namepart=';

class MultiselectAutocomplete {
  constructor(input, dropdown) {
    this.component = document.querySelector('.multiselect-autocomplete');
    this.input = input;
    this.dropdown = dropdown;
    this.component.appendChild(input.toNode());
    this.component.appendChild(dropdown.toNode());

    this.input.textInput.addEventListener('input', e => {
      if(e.target.value != '') {
        this.requestItems(e.target.value);
      }
    });

    this.input.textInput.addEventListener('keydown', e => {
      switch(e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.dropdown.highlightNextItem();
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.dropdown.highlightNextItem();
          break;
      }
    });
  }

  requestItems(inputValue) {
    fetch(requestURL + inputValue)
    .then((response) => response.json())
    .then((data) => {
      this.dropdown.populate(data);
    })
    .catch((error) => this.dropdown.message('Nothing found'));
    this.dropdown.message('Searching...');
  }

}

class Dropdown {
  constructor() {
    this.dropdown = document.createElement('div');
    this.dropdown.classList.add('multiselect-autocomplete-dropdown');
    this.dropdownItemsList = document.createElement('ul');
    this.dropdownItemsList.classList.add('multiselect-autocomplete-dropdown-items');
    this.dropdown.appendChild(this.dropdownItemsList);
    this.highlightedItem = null;
    this.highlightClass = 'multiselect-autocomplete-dropdown-item-highlighted';
    this.highlightedIndex = -1;
  }

  populate(items) {
    let dropdownElementsString = '';
    items.forEach((item) => {
      dropdownElementsString += `
        <li class="multiselect-dropdown-item">${item}</li>
      `;
    });
    this.dropdownItemsList.innerHTML = dropdownElementsString;
    this.highlightItem(0)
  }

  highlightItem(index) {
    switch(index) {
      default:
        this.highlightedItem = this.itemsArray()[index];
        break;
    }
    this.highlightedItem.classList.add(this.highlightClass);
    this.highlightedIndex = index;
  }

  highlightNextItem() {
    this.highlightItem(this.highlightedItem[highlightedIndex + 1]);
  }

  highlightPreviousItem() {
    this.highlightItem(this.highlightedItem[highlightedIndex - 1]);
  }

  itemsArray() {
    return Array.from(this.dropdownItemsList.children);
  }

  clear() {

  }

  message(msg) {
    this.dropdownItemsList.innerHTML = `<li>${msg}</li>`;
  }

  toNode() {
    return this.dropdown;
  }
}


class Input {
  constructor() {
    this.input = document.createElement('div');
    this.input.classList.add('multiselect-autocomplete-input');
    this.selectedItemsList = document.createElement('ul');
    this.selectedItemsList.classList.add('multiselect-autocomplete-selected-items');
    this.textInput = document.createElement('input');
    this.textInput.classList.add('multiselect-autocomplete-text-input');
    this.textInput.type = 'text';
    this.textInput.autocomplete = 'off';
    this.input.appendChild(this.selectedItemsList);
    this.input.appendChild(this.textInput);
  }

  addSelectedItem(item) {

  }

  removeSelectedItem() {

  }

  isItemSelected(item) {

  }

  toNode() {
    return this.input;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const multiselectAutocomplete = new MultiselectAutocomplete(
    new Input(),
    new Dropdown()
  );
});