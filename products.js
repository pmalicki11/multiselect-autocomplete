const hardCodedItems = ["Mleko","Miód", "Orzechy arachidowe","Olej kokosowy","Orzechy laskowe","Benzoensan sodu"];

document.addEventListener('DOMContentLoaded', function() {
  const multiselectTextInput = document.querySelector('.multiselect-text-input');
  multiselectTextInput.addEventListener('input', e => {
    if(!e.target.value == "")
      requestItems(e.target.value);
      //generateMultiselectDropdownList(hardCodedItems);
    else
      clearMultiselectDropdownList();
  });

  
  let highlightedDropdownItem = null;
  const multiselectDropdownList = document.querySelector('.multiselect-dropdown-list');
  

  function generateMultiselectDropdownList(items) {
    clearMultiselectDropdownList();
    let dropdownElements = '';
    items.forEach((item, i) => {
      dropdownElements += `<li class="multiselect-dropdown-item" data-index="${i}">${item}</li>`;
    });

    multiselectDropdownList.innerHTML = dropdownElements;

    Array.from(multiselectDropdownList.children).forEach(li => {
      li.addEventListener('mouseover', e => {  
        highlightDropdownItem(e.target);
      });
    });

    highlightDropdownItem(multiselectDropdownList.children[0]);
  }


  function requestItems(inputString) {
    const requestAddress = `http://pmalicki.com/alergens/products/ajax?namepart=${inputString}`;
    fetch(requestAddress)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      generateMultiselectDropdownList(data);
    })
    .catch((e) => multiselectDropdownList.innerHTML = '<li>Nothing found</li>');
    multiselectDropdownList.innerHTML = '<li>Searching...</li>';
  }


  multiselectTextInput.addEventListener('keydown', e => {
    if(e.key === 'Escape') {
      clearMultiselectDropdownList();
    } else if(e.key === 'ArrowUp') {
      e.preventDefault();
      highlightPreviousDropdownItem();
    } else if(e.key === 'ArrowDown') {
      e.preventDefault();
      highlightNextDropdownItem();
    }
  }, false);


  function showSearchingInfo() {
    
  }

  function clearMultiselectDropdownList() {
    multiselectDropdownList.innerHTML = "";
  }


  function highlightDropdownItem(item) {
    if(highlightedDropdownItem != null)
      highlightedDropdownItem.classList.remove('multiselect-dropdown-item-highlighted');
    highlightedDropdownItem = item;
    highlightedDropdownItem.classList.add('multiselect-dropdown-item-highlighted');
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
});