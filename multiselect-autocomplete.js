/** Multiselect input with autocomplete functionality class */
const requestItems = inputString => {
  return [
    'Masło',
    'Mleko',
    'Jajka',
  ];

  const requestAddress = `https://pmalicki.com/alergens/products/ajax?namepart=${inputString}`;
  return fetch(requestAddress)
    .then(response => response.json())
}

const KEYS = {
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ENTER: 'Enter',
  BACKSPACE: 'Backspace',
}

class MultiselectAutocomplete {
 
  constructor(inputArea, dropdown, requestCallback, config = {}) {
    this.selectedItems = [];
    this.requestCallback = requestCallback;
    this.inputArea = inputArea;
    this.dropdown = dropdown;

    const component = document.querySelector('.multiselect-autocomplete');
    component.appendChild(inputArea.toNode())
             .appendChild(dropdown.toNode())
    ;
    this.setEvents();

    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }
  
  addItem(item) {
    !this.selectedItems.includes(item) && this.selectedItems.push(item);
    this.inputArea.addToSelectedItems(item, this.removeItem);
  }

  removeItem(item) {
    this.selectedItems.includes(item) && this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
  }

  setEvents() {
    this.inputArea.textInput.addEventListener('input', e => {
      if(e.target.value.length > 0) {
        this.requestItems(e.target.value);
      } else {
        this.dropdown.clear();
      }
    });

    this.inputArea.textInput.addEventListener('keydown', e => {
      switch(e.key) {
        case KEYS.ESCAPE:
          // Clear dropdown
          break;
        case KEYS.ARROW_UP:
          e.preventDefault();
          this.dropdown.highlightPrevious();
          break;
        case KEYS.ARROW_DOWN:
          e.preventDefault();
          this.dropdown.highlightNext();
          break;
        case KEYS.ENTER:
          e.preventDefault();
          this.dropdown.pickItem(this.addItem);
          break;
        case KEYS.BACKSPACE:
          // Delete last item when input is empty.
          break;
      }
    });
  }
 
  requestItems(inputString) {
    const data = this.requestCallback(inputString);
    this.addDropdownItems(data);
    // this.requestCallback(inputString).then(data => {
    //   this.addDropdownItems(data);
    // })
    // .catch(error => this.dropdown.message('Nothing found'));
    // this.dropdown.message('Searching...');
  }
 
  addDropdownItems(items) {
    this.dropdown.populate(items, this.selectedItems, this.addItem);
  }
 
}
 
class Input {
  constructor() {
    this.buildStructure();
    this.setEvents();
  }
 
  buildStructure() {
    this.itemCount = 0;
    this.inputArea = document.createElement('div');
    this.inputArea.classList.add('multiselect-autocomplete-input');
    this.selectedItems = document.createElement('ul');
    this.selectedItems.classList.add('multiselect-autocomplete-selected-items');
    this.textInput = document.createElement('input');
    this.textInput.classList.add('multiselect-autocomplete-text-input');
    this.textInput.type = 'text';
    this.textInput.autocomplete = 'off';
    this.inputArea.appendChild(this.selectedItems);
    this.inputArea.appendChild(this.textInput);

    this.focusInput = this.focusInput.bind(this);
  }
 
  setEvents() {
    this.inputArea.addEventListener('click', this.focusInput);
  }
 
  focusInput() {
    this.textInput.focus();
  }

  addToSelectedItems(item, removeCallback) {
    const li = document.createElement('li');
    const i = document.createElement('i');
   
    li.classList.add('multiselect-autocomplete-selected-item');
    li.innerHTML = `<span>${item}</span>`;
    i.classList.add('material-icons');
    i.innerHTML = 'clear';
    const index = this.itemCount;
    i.addEventListener('click', e => {
      this.removeItem(index);
      removeCallback(item);
    });
 
    li.appendChild(i);
    this.selectedItems.appendChild(li);
    this.textInput.value = '';
    this.focusInput();
    this.itemCount++;
  }
  
  removeItem(index) {
    if(this.itemCount <= index) {
      return;
    }

    this.selectedItems.children[index].remove();
    this.itemCount--;
  }

  removeLastSelectedItem() {
    this.removeItem(this.itemCount - 1);
  }
 
  toNode() {
    return this.inputArea;
  }
}
 
class Dropdown {
  constructor() {
    this.highlightedIndex = -1;
    this.itemsList = [];
    this.dropdown = document.createElement('div');
    this.dropdown.classList.add('multiselect-autocomplete-dropdown');
    this.dropdownItems = document.createElement('ul');
    this.dropdownItems.classList.add('multiselect-autocomplete-dropdown-items');
    this.dropdown.appendChild(this.dropdownItems);
    this.highlightClass = 'multiselect-autocomplete-dropdown-item-highlighted';
  }

  populate(items, selectedItems, selectCallback) {
    this.clear();
    let dropdownElements = '';
    items.forEach((item, i) => {
      if(selectedItems.includes(item)) {
        return;
      }

      dropdownElements += `
        <li class="multiselect-dropdown-item" data-index="${i}">${item}</li>
      `;
    });

    this.dropdownItems.innerHTML = dropdownElements;
    Array.from(this.dropdownItems.children).forEach((li, index) => {
      this.itemsList.push(li);
      li.addEventListener('mouseover', e => {  
        this.highlightItem(index);
      });
      li.addEventListener('click', e => {
        selectCallback(e.target.innerHTML);
        this.clear();
      });
    });
    this.highlightFirstItem();
  }

  highlightNext() {
    this.highlightItem(this.highlightedIndex + 1);
  }

  highlightPrevious() {
    this.highlightItem(this.highlightedIndex - 1);
  }

  highlightItem(index) {
    if(this.itemsList.length === 0) {
      return;
    }
    if(this.highlightedIndex !== -1) {
      this.itemsList[this.highlightedIndex].classList.remove(this.highlightClass);
    }

    let highlightedItem;
    switch(index) {
      case -1:
        highlightedItem = this.itemsList[this.itemsList.length - 1];
        this.highlightedIndex = this.itemsList.length - 1;
        break;
      case this.itemsList.length:
        highlightedItem = this.itemsList[0];
        this.highlightedIndex = 0;
        break;
      default:
        highlightedItem = this.itemsList[index];
        this.highlightedIndex = index;
    }
    highlightedItem.classList.add(this.highlightClass);
  }
 
  highlightFirstItem() {
    this.highlightItem(0);
  }
 
  message(msg) {
    this.clear();
    this.dropdownItems.innerHTML = `<li>${msg}</li>`;
  }
 
  clear() {
    this.highlightedIndex = -1;
    this.itemsList = [];
    this.dropdownItems.innerHTML = '';
  }
  
  pickItem(pickCallback) {
    if(this.highlightedIndex !== -1) {
      pickCallback(this.itemsList[this.highlightedIndex].innerHTML);
      this.clear();
    }
  }

  toNode() {
    return this.dropdown;
  }
}
 
 
document.addEventListener('DOMContentLoaded', function() {
  const multiselectAutocomplete = new MultiselectAutocomplete(new Input(), new Dropdown(), requestItems);
});