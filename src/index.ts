import * as BlinkIDSDK from '@microblink/blinkid-in-browser-sdk';

declare const LICENSE_KEY: string | undefined;

const scanElement = document.getElementById('scan');
const titleElement = document.getElementById('title');
const loadingElement = document.getElementById('loading');
const loadingWrapperElement = document.getElementById('loading-wrapper');
const formElement = document.getElementById('form');
const cameraElement = document.getElementById('camera') as HTMLVideoElement;
const cameraWrapperElement = document.getElementById('camera-wrapper') as HTMLVideoElement;
const hintElement = document.getElementById('hint');
const firstNameInput = document.getElementById('firstName') as HTMLInputElement;
const lastNameInput = document.getElementById('lastName') as HTMLInputElement;
const dobInput = document.getElementById('dob') as HTMLInputElement;
const doeInput = document.getElementById('doe') as HTMLInputElement;

const hint = (message: string): void => {
  hintElement.innerText = message;
};

const scan = async (sdk: BlinkIDSDK.WasmSDK): Promise<void | null> => {
  cameraWrapperElement.classList.remove('d-none');
  scanElement.setAttribute('disabled', 'true');

  const recognizer = await BlinkIDSDK.createBlinkIdRecognizer(sdk);
  const runner = await BlinkIDSDK.createRecognizerRunner(sdk, [recognizer], false, {
    onQuadDetection: () => hint('Detecting the card...'),
    onDetectionFailed: () => hint('Cannot detect the card'),
  });

  const videoRecognizer = await BlinkIDSDK.VideoRecognizer.createVideoRecognizerFromCameraStream(
    cameraElement,
    runner,
  );

  const processResult = await videoRecognizer.recognize();

  if (processResult !== BlinkIDSDK.RecognizerResultState.Empty) {
    const recognitionResult = await recognizer.getResult();
    firstNameInput.value = recognitionResult.firstName;
    lastNameInput.value = recognitionResult.lastName;

    const dobValue = new Date();
    dobValue.setFullYear(recognitionResult?.dateOfBirth?.year);
    dobValue.setMonth(recognitionResult?.dateOfBirth?.month - 1);
    dobValue.setDate(recognitionResult?.dateOfBirth?.day);

    dobInput.value = dobValue.toDateString();

    const doeValue = new Date();
    doeValue.setFullYear(recognitionResult?.dateOfExpiry?.year);
    doeValue.setMonth(recognitionResult?.dateOfExpiry?.month - 1);
    doeValue.setDate(recognitionResult?.dateOfExpiry?.day);

    doeInput.value = doeValue.toLocaleDateString();
  }

  scanElement.removeAttribute('disabled');
  cameraWrapperElement.classList.add('d-none');
  videoRecognizer.releaseVideoFeed();
  runner.delete();
  recognizer.delete();
};

const setup = async (): Promise<void | null> => {
  if (!BlinkIDSDK.isBrowserSupported()) {
    titleElement.innerText = 'Browser not supported';
    return null;
  }

  try {
    const SDKConfig = new BlinkIDSDK.WasmSDKLoadSettings(LICENSE_KEY);

    SDKConfig.loadProgressCallback = (value) => {
      const normalizedValue = Math.round(value);

      if (!normalizedValue) {
        return;
      }

      loadingElement.style.width = `${normalizedValue}%`;
      loadingElement.setAttribute('aria-valuenow', `${normalizedValue}`);
      titleElement.innerText = `${normalizedValue}%`;
    };

    const sdk = await BlinkIDSDK.loadWasmModule(SDKConfig);

    titleElement.innerText = 'Document Scanner';
    loadingWrapperElement.classList.add('d-none');
    formElement.classList.remove('d-none');

    scanElement.addEventListener('click', (event) => {
      event.preventDefault();
      scan(sdk);
    });
  } catch {
    titleElement.innerText = 'Something went wrong';
  }
};

setup();
