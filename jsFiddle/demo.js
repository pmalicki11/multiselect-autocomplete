const foundItems = ["Mleko","Miód", "Orzechy arachidowe","Olej kokosowy","Orzechy laskowe","Benzoensan sodu"];

document.addEventListener('DOMContentLoaded', function() {
  const multiselectTextInput = document.querySelector('.multiselect-text-input');
  multiselectTextInput.addEventListener('input', e => {
    console.log('Request for: "' + e.target.value + '"');
    if(!e.target.value == "")
      generateMultiselectDropdownList(e.target.value);
    else
      clearMultiselectDropdownList();
  });

  let highlightedDropdownItem = null;
  const multiselectDropdownList = document.querySelector('.multiselect-dropdown-list');

  function generateMultiselectDropdownList(inputString) {
    // normally it should send ajax request and get the values
    // const foundItems = requestItems(inputString);
    clearMultiselectDropdownList();
    let dropdownElements = '';
    
    foundItems.forEach((item, i) => {
      dropdownElements += `<li class="multiselect-dropdown-item" data-index="${i}">${item}</li>`;
    });
    //console.log('Dropdown elements: ' + dropdownElements)
    multiselectDropdownList.innerHTML = dropdownElements;
    
    Array.from(multiselectDropdownList.children).forEach(li => {
      li.addEventListener('mouseover', e => {  
        highlightDropdownItem(e.target);
      });
    });

    highlightDropdownItem(multiselectDropdownList.children[0]);
  }

  multiselectTextInput.addEventListener('keydown', e => {
    console.log('Keydown: "' + e.key + '"');
    if(e.key === 'Escape') {
      clearMultiselectDropdownList();
    } else if(e.key === 'ArrowUp') {
      e.preventDefault();
      //highlightPreviousDropdownItem();
    } else if(e.key === 'ArrowDown') {
      e.preventDefault();
      highlightNextDropdownItem();
    }
  }, false);

  function clearMultiselectDropdownList() {
    multiselectDropdownList.innerHTML = "";
  }

  function highlightDropdownItem(item) {
    if(highlightedDropdownItem != null)
      highlightedDropdownItem.classList.remove('multiselect-dropdown-item-highlighted');
    highlightedDropdownItem = item;
    highlightedDropdownItem.classList.add('multiselect-dropdown-item-highlighted');
  }

});