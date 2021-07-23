import * as BlinkIDSDK from '@microblink/blinkid-in-browser-sdk';

const scanElement = document.getElementById('scan');
const cameraWrapperElement = document.getElementById('camera-wrapper') as HTMLVideoElement;
const hintElement = document.getElementById('hint');

const reset = ({
  videoRecognizer,
  runner,
  recognizer,
}: {
  videoRecognizer: BlinkIDSDK.VideoRecognizer;
  runner: BlinkIDSDK.RecognizerRunner;
  recognizer: BlinkIDSDK.Recognizer;
}) => {
  scanElement.removeAttribute('disabled');
  cameraWrapperElement.classList.add('d-none');
  scanElement.classList.remove('btn-danger');
  hintElement.innerText = '';

  videoRecognizer.releaseVideoFeed();
  runner.delete();
  recognizer.delete();
};

export default reset;
