import * as BlinkIDSDK from '@microblink/blinkid-in-browser-sdk';
import { DetectionStatus } from '@microblink/blinkid-in-browser-sdk';

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

export default hint;
