import './styles.css';

function component() {
  const element = document.createElement('div');

  element.innerHTML = 'Microblink SDK 2';

  return element;
}

document.body.appendChild(component());
