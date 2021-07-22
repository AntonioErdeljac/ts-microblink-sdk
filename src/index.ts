import * as BlinkIDSDK from '@microblink/blinkid-in-browser-sdk';

declare const LICENSE_KEY: string | undefined;

// Check if browser is supported
if (BlinkIDSDK.isBrowserSupported()) {
  const loadSettings = new BlinkIDSDK.WasmSDKLoadSettings(LICENSE_KEY);

  BlinkIDSDK.loadWasmModule(loadSettings).then(
    (wasmSDK: BlinkIDSDK.WasmSDK) => {
      console.log('SUCCESS!');
      // The SDK was initialized successfully, save the wasmSDK for future use
    },
    (error: any) => {
      // Error happened during the initialization of the SDK
      console.log('Error during the initialization of the SDK!', error);
    },
  );
} else {
  console.log('This browser is not supported by the SDK!');
}
