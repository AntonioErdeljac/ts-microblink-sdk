import * as BlinkIDSDK from '@microblink/blinkid-in-browser-sdk';
import { DetectionStatus } from '@microblink/blinkid-in-browser-sdk';

declare const LICENSE_KEY: string | undefined;

const scanElement = document.getElementById('scan');
const titleElement = document.getElementById('title');
const loadingElement = document.getElementById('loading');
const loadingWrapperElement = document.getElementById('loading-wrapper');
const formWapperElement = document.getElementById('form-wrapper');
const cameraElement = document.getElementById('camera') as HTMLVideoElement;
const cameraWrapperElement = document.getElementById('camera-wrapper') as HTMLVideoElement;
const hintElement = document.getElementById('hint');

const hintMap: Record<DetectionStatus, string> = {
  [BlinkIDSDK.DetectionStatus.Fail]: 'Detecting the document...',
  [BlinkIDSDK.DetectionStatus.Success]: 'Document detected',
  [BlinkIDSDK.DetectionStatus.CameraAtAngle]: 'Improve the angle',
  [BlinkIDSDK.DetectionStatus.CameraTooHigh]: 'Document too far',
  [BlinkIDSDK.DetectionStatus.DocumentTooCloseToEdge]: 'Document too close',
  [BlinkIDSDK.DetectionStatus.CameraTooNear]: 'Document too close',
  [BlinkIDSDK.DetectionStatus.Partial]: 'Document too close',
  [BlinkIDSDK.DetectionStatus.FallbackSuccess]: 'Document detected',
};

const hint = (quad: BlinkIDSDK.DisplayableQuad): void => {
  if (!hintMap[quad.detectionStatus]) {
    return;
  }

  hintElement.innerText = hintMap[quad.detectionStatus];
};

const updateField = (id: string, value: string) => {
  const element = document.getElementById(id) as HTMLInputElement;

  if (!element) {
    return;
  }

  element.value = value;
};

const clearFields = (...ids: string[]) => {
  ids.forEach((id) => {
    updateField(id, null);
  });
};

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

const scan = async (sdk: BlinkIDSDK.WasmSDK): Promise<void | null> => {
  try {
    cameraWrapperElement.classList.remove('d-none');
    scanElement.setAttribute('disabled', 'true');

    clearFields('firstName', 'lastName', 'dob', 'doe');

    const recognizer = await BlinkIDSDK.createBlinkIdRecognizer(sdk);
    const runner = await BlinkIDSDK.createRecognizerRunner(sdk, [recognizer], false, {
      onQuadDetection: (quad: BlinkIDSDK.DisplayableQuad) => hint(quad),
    });

    const videoRecognizer = await BlinkIDSDK.VideoRecognizer.createVideoRecognizerFromCameraStream(
      cameraElement,
      runner,
    );

    const processResult = await videoRecognizer.recognize();

    if (processResult !== BlinkIDSDK.RecognizerResultState.Empty) {
      const recognitionResult = await recognizer.getResult();

      updateField('firstName', recognitionResult.firstName);
      updateField('lastName', recognitionResult.lastName);

      const dobValue = new Date();
      dobValue.setFullYear(recognitionResult?.dateOfBirth?.year);
      dobValue.setMonth(recognitionResult?.dateOfBirth?.month - 1);
      dobValue.setDate(recognitionResult?.dateOfBirth?.day);

      updateField('dob', dobValue.toDateString());

      const doeValue = new Date();
      doeValue.setFullYear(recognitionResult?.dateOfExpiry?.year);
      doeValue.setMonth(recognitionResult?.dateOfExpiry?.month - 1);
      doeValue.setDate(recognitionResult?.dateOfExpiry?.day);

      updateField('doe', doeValue.toDateString());
    }

    reset({ videoRecognizer, runner, recognizer });
  } catch {
    titleElement.innerText = 'Something went wrong';
  }
};

const setup = async (): Promise<void | null> => {
  if (!BlinkIDSDK.isBrowserSupported()) {
    titleElement.innerText = 'Browser not supported';
    return null;
  }

  try {
    const SDKConfig = new BlinkIDSDK.WasmSDKLoadSettings(LICENSE_KEY);

    SDKConfig.allowHelloMessage = true;

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
    formWapperElement.classList.remove('d-none');

    scanElement.addEventListener('click', (event) => {
      event.preventDefault();
      scan(sdk);
    });
  } catch {
    titleElement.innerText = 'Something went wrong';
  }
};

setup();
