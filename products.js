
class Dropdown {
  
  constructor(node) {
    this.dropdownNode = node;
    this.highlightedItem = null;
  }


  addItems(items) {
    let dropdownElements = '';
    items.forEach((item, i) => {
      if(!isItemSelected(item)) {
        dropdownElements += `<li class="multiselect-dropdown-item" data-index="${i}">${item}</li>`;
      }
    });
    this.dropdownNode.innerHTML = dropdownElements;
    Array.from(this.dropdownNode.children).forEach((li) => {
      li.addEventListener('mouseover', (e) => {  
        this.highlightItem(e.target);
      });
      li.addEventListener('click', (e) => { 
        //this.addToSelectedItems(e.target.innerHTML);
      });
    });
  }


  highlightFirstItem() {
    this.highlightItem(this.dropdownNode.children[0]);
  }


  highlightItem(item) {
    if(this.highlightedItem != null){
      this.highlightedItem.classList.remove('multiselect-dropdown-item-highlighted');
    }
    this.highlightedItem = item;
    this.highlightedItem.classList.add('multiselect-dropdown-item-highlighted');
  }


  highlightNextItem() {
    if(this.highlightedItem) {
      this.highlightedItem.classList.remove('multiselect-dropdown-item-highlighted');
      if(this.highlightedItem.nextSibling) {
        this.highlightedItem = this.highlightedItem.nextSibling;
      } else {
        this.highlightedItem = this.highlightedItem.parentNode.firstChild;
      }
      this.highlightedItem.classList.add('multiselect-dropdown-item-highlighted');
    }
  }


  highlightPreviousItem() {
    if(this.highlightedItem) {
      this.highlightedItem.classList.remove('multiselect-dropdown-item-highlighted');
      if(this.highlightedItem.previousSibling) {
        this.highlightedItem = this.highlightedItem.previousSibling;
      } else {
        this.highlightedItem = this.highlightedItem.parentNode.lastChild;
      }
      this.highlightedItem.classList.add('multiselect-dropdown-item-highlighted');
    }
  }


  message(msg) {
    this.dropdownNode.innerHTML = `<li>${msg}</li>`;
    this.resetHighlightedItem();
  }


  clear() {
    this.dropdownNode.innerHTML = '';
    this.resetHighlightedItem();
  }

  resetHighlightedItem() {
    this.highlightedItem = null;
  }
}



document.addEventListener('DOMContentLoaded', function() {
  const multiselectinputWrapper = document.querySelector('.multiselect-input-wrapper');
  const multiselectSelectedItems = document.querySelector('.multiselect-selected-list');
  const multiselectTextInput = document.querySelector('.multiselect-text-input');
  const multiselectDropdownList = document.querySelector('.multiselect-dropdown-list');
  const dropdown = new Dropdown(multiselectDropdownList);

  multiselectinputWrapper.addEventListener('click', focusOnInput);

  multiselectTextInput.addEventListener('input', (e) => {
    if(!e.target.value == '') {
      requestItems(e.target.value);
    } else {
      dropdown.clear();
    }
  });
  
  function requestItems(inputString) {
    const requestAddress = `https://pmalicki.com/alergens/products/ajax?namepart=${inputString}`;
    fetch(requestAddress)
    .then((response) => response.json())
    .then((data) => {
      generateMultiselectDropdownList(data);
    })
    .catch(dropdown.message('Nothing found'));
    dropdown.message('Searching...');
  }


  function generateMultiselectDropdownList(items) {
    dropdown.clear();
    dropdown.addItems(items);
    dropdown.highlightFirstItem();
  }


  multiselectTextInput.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
      dropdown.clear();
    } else if(e.key === 'ArrowUp') {
      e.preventDefault();
      dropdown.highlightPreviousItem();
    } else if(e.key === 'ArrowDown') {
      e.preventDefault();
      dropdown.highlightNextItem();
    } else if(e.key === 'Enter') {
      e.preventDefault();
      if(dropdown.highlightedItem) {
        addToSelectedItems(dropdown.highlightedItem.innerHTML);
      }
    } else if(e.key === 'Backspace') {
      if(multiselectTextInput.value == '') {
        removeLastSelectedItem();
      }
    }
  });


  function addToSelectedItems(item) {
    const li = document.createElement('li');
    const i = document.createElement('i');
    
    li.classList.add('multiselect-selected-item');
    li.innerHTML = `<span>${item}</span>`;
    i.classList.add('material-icons');
    i.innerHTML = 'clear';
    i.addEventListener('click', removeSelectedItem);

    li.appendChild(i);
    multiselectSelectedItems.appendChild(li);
    clearInput();
    focusOnInput();
    resetHighlightedItem();
  }


  function clearInput() {
    multiselectTextInput.value = '';
    clearMultiselectDropdownList();
  }


  function focusOnInput() {
    multiselectTextInput.focus();
  }


  function removeSelectedItem() {
    multiselectSelectedItems.removeChild(this.parentNode);
  }


  function removeLastSelectedItem() {
    if(multiselectSelectedItems.childElementCount > 0) {
      multiselectSelectedItems.removeChild(multiselectSelectedItems.lastChild);
    }
  }


  function isItemSelected(item) {
    let isSelected = false;
    if(multiselectSelectedItems.children.length > 0) {
      Array.from(multiselectSelectedItems.children).forEach((li) => {
        if(li.firstChild.innerHTML == item) {
          isSelected = true;
          return;
        }
      });
    }
    return isSelected;
  }

});