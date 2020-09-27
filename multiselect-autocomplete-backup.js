/** Multiselect input with autocomplete functionality class */
class MultiselectAutocomplete {
  
  constructor(inputArea, dropdown) {
    this.component = document.querySelector('.multiselect-autocomplete');
    this.input = input;
    this.dropdown = dropdown;
    this.component.appendChild(input.toNode());
    this.component.appendChild(dropdown.toNode());
    this.setEvents();
  }

  setEvents() {
    this.inputArea.textInput.addEventListener('input', (e) => {
      if(!e.target.value == '') {
        this.requestItems(e.target.value);
      } else {
        this.dropdown.clear();
      }
    });
    this.inputArea.textInput.addEventListener('keydown', (e) => {
      if(e.key === 'Escape') {
        this.dropdown.clear();
      } else if(e.key === 'ArrowUp') {
        e.preventDefault();
        this.dropdown.highlightPreviousItem();
      } else if(e.key === 'ArrowDown') {
        e.preventDefault();
        this.dropdown.highlightNextItem();
      } else if(e.key === 'Enter') {
        e.preventDefault();
        if(this.dropdown.highlightedItem) {
          this.inputArea.addToSelectedItems(this.dropdown.highlightedItem.innerHTML);
          this.dropdown.clear();
        }
      } else if(e.key === 'Backspace') {
        if(this.inputArea.textInput.value == '') {
          this.inputArea.removeLastSelectedItem();
        }
      }
    });
  }

  requestItems(inputString) {
    const requestAddress = `https://pmalicki.com/alergens/products/ajax?namepart=${inputString}`;
    fetch(requestAddress)
    .then((response) => response.json())
    .then((data) => {
      this.addDropdownItems(data);
    })
    .catch((error) => this.dropdown.message('Nothing found'));
    this.dropdown.message('Searching...');
  }

  addDropdownItems(items) {
    this.dropdown.clear();
    let dropdownElements = '';
    items.forEach((item, i) => {
      if(!this.inputArea.isItemSelected(item)) {
        dropdownElements += `
        <li class="multiselect-dropdown-item" data-index="${i}">${item}</li>`;
      }
    });
    this.dropdown.dropdownItems.innerHTML = dropdownElements;
    Array.from(this.dropdown.dropdownItems.children).forEach((li) => {
      li.addEventListener('mouseover', (e) => {  
        this.dropdown.highlightItem(e.target);
      });
      li.addEventListener('click', (e) => { 
        this.inputArea.addToSelectedItems(e.target.innerHTML);
        this.dropdown.clear();
      });
    });
    this.dropdown.highlightFirstItem();
  }

}

class Input {
  constructor() {
    this.buildStructure();
    this.setEvents();
  }

  buildStructure() {
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
  }

  setEvents() {
    this.inputArea.addEventListener('click', () => this.textInput.focus());
  }

  addToSelectedItems(item) {
    const li = document.createElement('li');
    const i = document.createElement('i');
    
    li.classList.add('multiselect-autocomplete-selected-item');
    li.innerHTML = `<span>${item}</span>`;
    i.classList.add('material-icons');
    i.innerHTML = 'clear';
    i.addEventListener('click', (e) => this.selectedItems.removeChild(e.target.parentNode));

    li.appendChild(i);
    this.selectedItems.appendChild(li);
    this.textInput.value = '';
    this.textInput.focus();
  }
  
  removeLastSelectedItem() {
    if(this.selectedItems.childElementCount > 0) {
      this.selectedItems.removeChild(this.selectedItems.lastElementChild);
    }
  }

  isItemSelected(item) {
    let isSelected = false;
    if(this.selectedItems.children.length > 0) {
      Array.from(this.selectedItems.children).forEach((li) => {
        if(li.firstChild.innerHTML == item) {
          isSelected = true;
          return;
        }
      });
    }
    return isSelected;
  }
  
  getTextInput() {
    return this.textInput;
  }

  toNode() {
    return this.inputArea;
  }
}

class Dropdown {
  constructor() {
    this.dropdown = document.createElement('div');
    this.dropdown.classList.add('multiselect-autocomplete-dropdown');
    this.dropdownItems = document.createElement('ul');
    this.dropdownItems.classList.add('multiselect-autocomplete-dropdown-items');
    this.dropdown.appendChild(this.dropdownItems);
    this.highlightedItem = null;
    this.highlightClass = 'multiselect-autocomplete-dropdown-item-highlighted';
  }

  highlightItem(item) {
    if(this.highlightedItem != null){
      this.highlightedItem.classList.remove(this.highlightClass);
    }
    this.highlightedItem = item;
    this.highlightedItem.classList.add(this.highlightClass);
  }

  highlightFirstItem() {
    this.highlightItem(this.dropdownItems.children[0]);
  }

  highlightNextItem() {
    if(this.highlightedItem) {
      this.highlightedItem.classList.remove(this.highlightClass);
      if(this.highlightedItem.nextElementSibling) {
        this.highlightedItem = this.highlightedItem.nextElementSibling;
      } else {
        this.highlightedItem = this.highlightedItem.parentNode.firstElementChild;
      }
      this.highlightedItem.classList.add(this.highlightClass);
    }
  }

  highlightPreviousItem() {
    if(this.highlightedItem) {
      this.highlightedItem.classList.remove(this.highlightClass);
      if(this.highlightedItem.previousElementSibling) {
        this.highlightedItem = this.highlightedItem.previousElementSibling;
      } else {
        this.highlightedItem = this.highlightedItem.parentNode.lastElementChild;
      }
      this.highlightedItem.classList.add(this.highlightClass);
    }
  }

  message(msg) {
    this.dropdownItems.innerHTML = `<li>${msg}</li>`;
    this.resetHighlightedItem();
  }

  resetHighlightedItem() {
    this.highlightedItem = null;
  }

  clear() {
    this.dropdownItems.innerHTML = '';
    this.resetHighlightedItem();
  }

  toNode() {
    return this.dropdown;
  }
}


document.addEventListener('DOMContentLoaded', function() {
  const multiselectAutocomplete = new MultiselectAutocomplete(new Input(), new Dropdown());
});