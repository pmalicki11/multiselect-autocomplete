let formString = document.querySelector('#sample-form').innerHTML;
formString = formString.replaceAll('<', '&lt;');
formString = formString.replaceAll('>', '&gt;');
var lines = formString.split("\n");
lines.shift();
lines.pop();

const blueElements = [
  '&gt;',
  '&lt;form',
  '&lt;/form',
  '&lt;div',
  '&lt;/div',
  '&lt;label',
  '&lt;/label',
  '&lt;input',
  '&lt;button',
  '&lt;/button'
];

const lightBlueElements = [
  ' class',
  ' action',
  ' for',
  ' id',
  ' name',
  ' type'
];

const redElements = [
  '"#"',
  '"i1"',
  '"i2"',
  '"i3"',
  '"i4"',
  '"i5"',
  '"text"',
  '"form-control"',
  '"form-group row align-items-center"',
  '"control-label col-md-3 font-weight-bold"',
  '"col-md-5"',
  '"col-md-9"',
  '"multiselect-autocomplete-1"',
  '"multiselect-autocomplete-2"',
  '"submit"',
  '"btn btn-primary"'
];

let i = 0;
for(i; i < lines.length; i++) {
  lines[i] = lines[i].substr(10);
  lightBlueElements.forEach(element => lines[i] = lines[i].replaceAll(element, lightBlue(element)));
  blueElements.forEach(element => lines[i] = lines[i].replaceAll(element, blue(element)));
  redElements.forEach(element => lines[i] = lines[i].replaceAll(element, red(element)));
}

document.write(lines.join('\n'));


function blue(str) {
  return `<span class="text-primary">${str}</span>`;
}

function lightBlue(str) {
  return `<span class="text-info">${str}</span>`;
}

function red(str) {
  return `<span class="text-danger">${str}</span>`;
}