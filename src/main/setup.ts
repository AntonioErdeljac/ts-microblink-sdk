import * as BlinkIDSDK from '@microblink/blinkid-in-browser-sdk';

import scan from './scan';
import { toast } from '../feedback';

declare const LICENSE_KEY: string | undefined;

const scanElement = document.getElementById('scan');
const titleElement = document.getElementById('title');
const loadingElement = document.getElementById('loading');
const loadingWrapperElement = document.getElementById('loading-wrapper');
const formWapperElement = document.getElementById('form-wrapper');

const setup = async (): Promise<void | null> => {
  if (!BlinkIDSDK.isBrowserSupported()) {
    toast('Please stop using IE.');
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
    toast('Something went wrong');
  }
};

export default setup;
