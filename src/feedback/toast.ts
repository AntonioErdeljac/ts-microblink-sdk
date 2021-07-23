const messageWrapperElement = document.getElementById('message-wrapper');
const messageElement = document.getElementById('message-body');

const TOAST_TIMEOUT_MS = 3000;

const toast = (message: string) => {
  messageElement.innerText = message;
  messageWrapperElement.classList.add('show');

  setTimeout(() => {
    messageWrapperElement.classList.remove('show');
  }, TOAST_TIMEOUT_MS);
};

export default toast;
