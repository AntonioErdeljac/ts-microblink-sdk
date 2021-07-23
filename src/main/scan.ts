import * as BlinkIDSDK from '@microblink/blinkid-in-browser-sdk';

import { toast, hint } from '../feedback';
import { clearFields, updateField, reset } from '../form';

const scanElement = document.getElementById('scan');
const cameraElement = document.getElementById('camera') as HTMLVideoElement;
const cameraWrapperElement = document.getElementById('camera-wrapper') as HTMLVideoElement;
const hintElement = document.getElementById('hint');

const scan = async (sdk: BlinkIDSDK.WasmSDK): Promise<void | null> => {
  try {
    cameraWrapperElement.classList.remove('d-none');
    scanElement.setAttribute('disabled', 'true');

    clearFields('firstName', 'lastName', 'dob', 'doe');

    const recognizer = await BlinkIDSDK.createBlinkIdRecognizer(sdk);
    const runner = await BlinkIDSDK.createRecognizerRunner(sdk, [recognizer], false, {
      onQuadDetection: (quad: BlinkIDSDK.DisplayableQuad) => hint(quad),
    });

    hintElement.innerText = 'Please can the front side of the document.';

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

      toast('Document scanned.');
    }

    reset({ videoRecognizer, runner, recognizer });
  } catch {
    toast('An error occured, make sure you have the right permissions set.');
  }
};

export default scan;
