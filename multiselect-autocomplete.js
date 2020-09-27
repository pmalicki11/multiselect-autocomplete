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
      } else {
        this.dropdown.clear();
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
          this.dropdown.highlightPreviousItem();
          break;
        case 'Escape':
          e.preventDefault();
          this.dropdown.clear();
          break;
      }
    });
    this.addToSelected = this.addToSelected.bind(this);
  }

  requestItems(inputValue) {
    fetch(requestURL + inputValue)
    .then(response => response.json())
    .then(data => {
      this.dropdown.populate(data, this.addToSelected);
    })
    .catch(error => this.dropdown.message('Nothing found'));
    this.dropdown.message('Searching...');
  }

  addToSelected(item) {
    this.input.addSelectedItem(item);
    this.dropdown.clear();
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

  populate(items, addToSelectedCallback) {
    let dropdownElementsString = '';
    items.forEach(item => {
      dropdownElementsString += `
        <li class="multiselect-dropdown-item">${item}</li>
      `;
    });
    this.dropdownItemsList.innerHTML = dropdownElementsString;
    this.highlightItem(0);
    this.itemsArray().forEach(item => item.addEventListener('click', e => addToSelectedCallback(e.target.innerHTML)));
  }

  highlightItem(index) {
    const numOfItems = this.itemsArray().length;
    if(numOfItems != 0) {
      if(this.highlightedItem != null) {
        this.highlightedItem.classList.remove(this.highlightClass);
      }
      switch(index) {
        case -1:
        this.highlightedIndex = numOfItems - 1;
        this.highlightedItem = this.itemsArray()[this.highlightedIndex];
        break;
      case numOfItems:
        this.highlightedIndex = 0;
        this.highlightedItem = this.itemsArray()[this.highlightedIndex];
        break;
      default:
        this.highlightedIndex = index;
        this.highlightedItem = this.itemsArray()[this.highlightedIndex];
        break;
      }
      this.highlightedItem.classList.add(this.highlightClass);
    }
  }

  highlightNextItem() {
    this.highlightItem(this.highlightedIndex + 1);
  }

  highlightPreviousItem() {
    this.highlightItem(this.highlightedIndex - 1);
  }

  itemsArray() {
    return Array.from(this.dropdownItemsList.children);
  }

  clear() {
    this.highlightedItem = null;
    this.highlightedIndex = -1;
    this.dropdownItemsList.innerHTML = '';
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

    this.removeSelectedItem = this.removeSelectedItem.bind(this);
  }

  addSelectedItem(item) {
    const li = document.createElement('li');
    li.classList.add('multiselect-autocomplete-selected-item');
    li.innerHTML = `<span>${item}</span>`;
    const i = document.createElement('i');
    i.classList.add('material-icons');
    i.innerHTML = 'clear';
    i.addEventListener('click', this.removeSelectedItem);
    li.appendChild(i);
    this.selectedItemsList.appendChild(li);
    this.textInput.value = '';
  }

  removeSelectedItem(item) {
    console.log('Remove: ' + item.target.innerHTML);
  }

  isItemSelected(item) {}

  itemsArray() {
    return Array.from(this.selectedItemsList.children);
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