class MultiselectAutocomplete {
  constructor() {
    this.component = document.querySelector('.multiselect-autocomplete');
    
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('multiselect-autocomplete-wrapper');
    this.component.appendChild(this.wrapper);

    this.dropdown = document.createElement('div');
    this.dropdown.classList.add('multiselect-autocomplete-wrapper');
    this.component.appendChild(this.wrap);
    //<div class="multiselect-dropdown">



  const multiselectTextInput = document.querySelector('.multiselect-text-input');
  const multiselectDropdownList = document.querySelector('.multiselect-dropdown-list');

  }
}

document.addEventListener('DOMContentLoaded', function() {
  const multiselectAutocomplete = new MultiselectAutocomplete();
});

/*
<div class="multiselect-autocomplete">
  
  <div class="multiselect-autocomplete-input">
    <ul class="multiselect-autocomplete-selected-items"></ul>
    <input type="text" class="multiselect-autocomplete-text-input" autocomplete="off" />
  </div>
  <div class="multiselect-autocomplete-dropdown">
    <ul class="multiselect-autocomplete-dropdown-items"></ul>
  </div>

</div>
*/