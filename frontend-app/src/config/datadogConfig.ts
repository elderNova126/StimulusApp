import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: process.env.REACT_APP_DATA_DOG_APPLICATION_ID ?? '',
  clientToken: process.env.REACT_APP_DATA_DOG_CLIENT_TOKEN ?? '',
  site: 'us5.datadoghq.com',
  service: process.env.REACT_APP_DATA_DOG_SERVICE_NAME || 'stimulus-frontend',
  env: process.env.REACT_APP_DATA_DOG_ENVIRONMENT || 'dev',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 100,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'allow',
});

datadogRum.startSessionReplayRecording();

export default datadogRum;
