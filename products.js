class Dropdown {
  
  constructor(node) {
    this.dropdownNode = node;
    this.highlightedItem = null;
  }

  addItems(items) {
    this.dropdownNode.innerHTML = items;
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
}



document.addEventListener('DOMContentLoaded', function() {
  let highlightedDropdownItem = null;
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
      clearMultiselectDropdownList();
    }
  });
  
  function requestItems(inputString) {
    const requestAddress = `https://pmalicki.com/alergens/products/ajax?namepart=${inputString}`;
    fetch(requestAddress)
    .then((response) => response.json())
    .then((data) => {
      generateMultiselectDropdownList(data);
    })
    .catch(showNothingFound);
    showSearchingInfo();
  }


  function generateMultiselectDropdownList(items) {
    clearMultiselectDropdownList();
    let dropdownElements = '';
    items.forEach((item, i) => {
      if(!isItemSelected(item)) {
        dropdownElements += `<li class="multiselect-dropdown-item" data-index="${i}">${item}</li>`;
      }
    });

    dropdown.addItems(dropdownElements);
    dropdown.highlightFirstItem();
  }


  function highlightNextDropdownItem() {
    if(highlightedDropdownItem) {
      highlightedDropdownItem.classList.remove('multiselect-dropdown-item-highlighted');
      if(highlightedDropdownItem.nextSibling) {
        highlightedDropdownItem = highlightedDropdownItem.nextSibling;
      } else {
        highlightedDropdownItem = highlightedDropdownItem.parentNode.firstChild;
      }
      highlightedDropdownItem.classList.add('multiselect-dropdown-item-highlighted');
    }
  }


  function highlightPreviousDropdownItem() {
    if(highlightedDropdownItem) {
      highlightedDropdownItem.classList.remove('multiselect-dropdown-item-highlighted');
      if(highlightedDropdownItem.previousSibling) {
        highlightedDropdownItem = highlightedDropdownItem.previousSibling;
      } else {
        highlightedDropdownItem = highlightedDropdownItem.parentNode.lastChild;
      }
      highlightedDropdownItem.classList.add('multiselect-dropdown-item-highlighted');
    }
  }


  function clearMultiselectDropdownList() {
    multiselectDropdownList.innerHTML = '';
	highlightedDropdownItem = null;
  }

  
  function showSearchingInfo() {
    multiselectDropdownList.innerHTML = '<li>Searching...</li>';
    highlightedDropdownItem = null;
  }


  function showNothingFound() {
    multiselectDropdownList.innerHTML = '<li>Nothing found</li>'
    highlightedDropdownItem = null;
  }


  multiselectTextInput.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
      clearMultiselectDropdownList();
    } else if(e.key === 'ArrowUp') {
      e.preventDefault();
      highlightPreviousDropdownItem();
    } else if(e.key === 'ArrowDown') {
      e.preventDefault();
      highlightNextDropdownItem();
    } else if(e.key === 'Enter') {
      e.preventDefault();
      if(highlightedDropdownItem) {
        addToSelectedItems(highlightedDropdownItem.innerHTML);
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
    highlightedDropdownItem = null;
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