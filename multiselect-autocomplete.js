document.addEventListener('DOMContentLoaded', function() {

  const multiselectAutocomplete1 = new MultiselectAutocomplete({
    "element": document.querySelector('.multiselect-autocomplete-1'),
    "requestURL": "https://pmalicki.com/alergens/products/ajax?namepart=",
    "inputValueAsRequestPart": true,
    "filterRequestDataByInput": false,
    "maxDropdownItems": 5 
  });

  const multiselectAutocomplete2 = new MultiselectAutocomplete({
    "element": document.querySelector('.multiselect-autocomplete-2'),
    "requestURL": "https://run.mocky.io/v3/530a0a11-fb6e-4afd-bb42-dc55f91bb6d1",
    "inputValueAsRequestPart": false,
    "filterRequestDataByInput": true,
    "maxDropdownItems": 10
  });
});


class MultiselectAutocomplete {
  constructor(params) {
    if(params.hasOwnProperty('element')) { this.component = params.element; }
    else { throw 'Error: No Element set in constructor params.'; }
    
    if(params.hasOwnProperty('requestURL')) { this.requestURL = params.requestURL; }
    else { throw 'Error: No Request URL set in constructor params.'; }

    this.inputValueAsRequestPart = false;
    if(params.hasOwnProperty('inputValueAsRequestPart') && params.inputValueAsRequestPart) {
      this.inputValueAsRequestPart = true;
    }

    this.filterRequestDataByInput = true;
    if(params.hasOwnProperty('filterRequestDataByInput') && !params.filterRequestDataByInput) {
      this.filterRequestDataByInput = false;
    }

    this.maxDropdownItems = 5;
    if(params.hasOwnProperty('maxDropdownItems') && params.maxDropdownItems > 5) {
      this.maxDropdownItems = params.maxDropdownItems;
    }
    
    this.input = new Input();
    this.dropdown = new Dropdown();
    this.component.appendChild(this.input.toNode());
    this.component.appendChild(this.dropdown.toNode());
    this.selectedItems = [];
    this.addToSelected = this.addToSelected.bind(this);
    this.removeFromSelected = this.removeFromSelected.bind(this);

    this.input.textInput.addEventListener('input', e => {
      if(e.target.value != '') {
        this.requestItems(e.target.value, this.requestURL, this.inputValueAsRequestPart, this.filterRequestDataByInput);
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

  requestItems(inputValue, requestURL, inputValueAsRequestPart, filterRequestDataByInput) {
    const requestString = inputValueAsRequestPart ? requestURL + inputValue : requestURL;
    fetch(requestString)
    .then(response => response.json())
    .then(data => {
      let filteredData = [];
      if(filterRequestDataByInput) {
        const searchPattern = new RegExp('^' + inputValue, 'i');
        data.forEach(item => {
          if(searchPattern.test(item)) {
            filteredData.push(item);
          }
        });
      } else {
        filteredData = data;
      }
      this.dropdown.populate(filteredData, this.selectedItems, this.addToSelected, this.maxDropdownItems);
    })
    .catch(error => this.dropdown.message('Nothing found'));
    this.dropdown.message(`
      <span class="spinner-border spinner-border-sm text-primary aria-hidden="true"" role="status"></span>
      <span>Searching...</span>
    `);
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

  populate(items, selectedItems, addToSelectedCallback, maxDropdownItems) {
    this.clear();
    let elementsToAdd = [];
    items.forEach(item => {
      if(!selectedItems.includes(item)) {
        elementsToAdd.push(item);
      }
    });

    if(elementsToAdd.length == 0) {
      throw 'Nothing added';
    }

    const elementsTotal = elementsToAdd.length;
    let i;
    for(i = 0; i < elementsTotal; i++) {
      if(i < maxDropdownItems) {
        this.dropdownItemsList.innerHTML += `<div class="list-group-item p-2">${elementsToAdd[i]}</div>`;
      } else {
        const remainingElements = elementsTotal - i;
        const rStr = (remainingElements > 1) ? 'items' : 'item';
        this.dropdownItemsList.innerHTML += `<span class="text-right text-info font-weight-bold">+${remainingElements} ${rStr}</span>`;
        break;
      }
    }
    
    Array.from(this.dropdownItemsList.children).forEach((item, index) => {
      if(item.tagName === 'DIV') {
        item.addEventListener('mousedown', e => addToSelectedCallback(e.target));
        item.addEventListener('mouseover', e => this.highlightItem(index));
        this.itemsArray.push(item);
      }
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