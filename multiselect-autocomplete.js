const requestURL = 'https://pmalicki.com/alergens/products/ajax?namepart=';

class MultiselectAutocomplete {
  constructor(input, dropdown) {
    this.component = document.querySelector('.multiselect-autocomplete');
    this.input = input;
    this.dropdown = dropdown;
    this.component.appendChild(input.toNode());
    this.component.appendChild(dropdown.toNode());
    this.selectedItems = [];
    this.addToSelected = this.addToSelected.bind(this);
    this.removeFromSelected = this.removeFromSelected.bind(this);

    this.input.textInput.addEventListener('input', e => {
      if(e.target.value != '') {
        this.requestItems(e.target.value);
      } else {
        this.dropdown.clear();
      }
    });
    
    this.input.textInput.addEventListener('focus', e => {
      this.input.input.classList.add('multiselect-autocomplete-input-focus');
    });

    this.input.textInput.addEventListener('blur', e => {
      if(this.itemAdded) {
        this.itemAdded = false;
      } else {
        this.input.textInput.value = '';
        this.dropdown.clear();
        this.input.input.classList.remove('multiselect-autocomplete-input-focus');
      }
    });


    this.input.input.addEventListener('click', e => {
      if(e.target.tagName != 'INPUT') {
        this.input.focusInput();
      } 
    });

    this.input.textInput.addEventListener('keydown', e => {
      switch(e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.dropdown.highlightNextItem();
          break;
        case 'ArrowUp':
          e.preventDefault();6
          this.dropdown.highlightPreviousItem();
          break;
        case 'Escape':
          e.preventDefault();
          this.dropdown.clear();
          break;
        case 'Enter':
          e.preventDefault();
          if(this.dropdown.highlightedIndex >= 0) {
            this.addToSelected(this.dropdown.itemsArray[this.dropdown.highlightedIndex]);
          }
          break;
        case 'Backspace':
          if(this.selectedItems.length > 0 && e.target.value.length == 0) {
            this.removeLastFromSelected();
          }
          break;
      }
    });
  }

  requestItems(inputValue) {
    fetch(requestURL + inputValue)
    .then(response => response.json())
    .then(data => this.dropdown.populate(data, this.selectedItems, this.addToSelected))
    .catch(error => this.dropdown.message('Nothing found'));
    this.dropdown.message('Searching...');
  }

  addToSelected(item) {
    this.input.addSelectedItem(item.innerHTML, this.removeFromSelected);
    this.selectedItems.push(item.innerHTML);
    this.dropdown.clear();
    this.itemAdded = true;
    setTimeout(e => e.input.focusInput(), 1, this);
  }

  removeFromSelected(item) {
    this.input.removeSelectedItem(item);
    const index = this.selectedItems.indexOf(item.children[0].innerHTML);
    this.selectedItems.splice(index, 1);
  }

  removeLastFromSelected() {
    this.input.removeLastItem();
    this.selectedItems.pop();
  }
}


class Dropdown {
  constructor() {
    this.dropdown = document.createElement('div');
    this.dropdownItemsList = document.createElement('div');
    this.dropdownItemsList.classList.add('list-group', 'mt-0', 'position-absolute', 'dropdown-overlay');
    this.dropdown.appendChild(this.dropdownItemsList);
    this.highlightedItem = null;
    this.highlightClass = 'active';
    this.highlightedIndex = -1;
    this.itemsArray = [];
  }

  populate(items, selectedItems, addToSelectedCallback) {
    this.clear();
    let dropdownElementsString = '';
    items.forEach(item => {
      if(!selectedItems.includes(item)) {
        dropdownElementsString += `<div class="list-group-item p-2">${item}</div>`;
      }
    });
    if(dropdownElementsString.length == 0) {
      throw 'Nothing added';
    }
    this.dropdownItemsList.innerHTML = dropdownElementsString;
    
    Array.from(this.dropdownItemsList.children).forEach((item, index) => {
      item.addEventListener('mousedown', e => addToSelectedCallback(e.target));
      item.addEventListener('mouseover', e => this.highlightItem(index));
      this.itemsArray.push(item);
    });

    this.highlightItem(0);
  }

  highlightItem(index) {
    const numOfItems = this.itemsArray.length;
    if(numOfItems != 0) {
      if(this.highlightedItem != null) {
        this.highlightedItem.classList.remove(this.highlightClass);
      }
      switch(index) {
        case -1:
        this.highlightedIndex = numOfItems - 1;
        this.highlightedItem = this.itemsArray[this.highlightedIndex];
        break;
      case numOfItems:
        this.highlightedIndex = 0;
        this.highlightedItem = this.itemsArray[this.highlightedIndex];
        break;
      default:
        this.highlightedIndex = index;
        this.highlightedItem = this.itemsArray[this.highlightedIndex];
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

  clear() {
    this.highlightedItem = null;
    this.highlightedIndex = -1;
    this.itemsArray = [];
    this.dropdownItemsList.innerHTML = '';
  }


  message(msg) {
    this.dropdownItemsList.innerHTML = `<div class="list-group-item p-2">${msg}</div>`;
  }

  toNode() {
    return this.dropdown;
  }
}


class Input {
  constructor() {
    this.input = document.createElement('div');
    this.input.classList.add('multiselect-autocomplete-input');
    this.selectedItemsList = document.createElement('div');
    this.selectedItemsList.classList.add('d-block');
    this.textInput = document.createElement('input');
    this.textInput.type = 'text';
    this.textInput.classList.add('d-inline-flex', 'border-0', 'rounded', 'border-0-on-focus', 'py-6', 'px-12');
    this.textInput.autocomplete = 'off';
    this.input.appendChild(this.selectedItemsList);
    this.input.appendChild(this.textInput);
  }

  addSelectedItem(item, removeItemCallback) {
    const div = document.createElement('div');
    div.classList.add('badge', 'badge-secondary', 'd-inline-flex', 'align-items-center', 'mt-1', 'ml-1');
    const span = document.createElement('span');
    span.classList.add('badge-text', 'font-weight-normal');
    span.innerHTML = item;
    
    const i = document.createElement('i');
    i.classList.add('material-icons');
    i.innerHTML = 'clear';
    i.addEventListener('click', e => removeItemCallback(div));

    const input = document.createElement('input');
    Object.assign(input, {
      className: 'd-none',
      type: 'text',
      name: 'multiselectOption[]',
      value: item
    });

    div.appendChild(span);
    div.appendChild(i);
    div.appendChild(input);

    this.selectedItemsList.appendChild(div);
    this.textInput.value = '';
  }

  removeSelectedItem(item) {
    this.selectedItemsList.removeChild(item);
  }

  removeLastItem() {
    this.selectedItemsList.removeChild(this.selectedItemsList.lastChild);
  }

  focusInput() {
    this.textInput.focus();
  }

  itemsArray() {
    return Array.from(this.selectedItemsList.children);
  }

  toNode() {
    return this.input;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const multiselectAutocomplete = new MultiselectAutocomplete(new Input(), new Dropdown());
});