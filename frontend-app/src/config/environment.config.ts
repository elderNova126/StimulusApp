import version from './version.json';

const config = {
  GRAPHQL_URI: process.env.REACT_APP_GRAPHQL_URI as string,
  REST_URI: process.env.REACT_APP_REST_URI as string,
  AD_INSTANCE: process.env.REACT_APP_AD_INSTANCE as string,
  AD_TENANT: process.env.REACT_APP_AD_TENANT as string,
  AD_TENANT_ID: process.env.REACT_APP_AD_TENANT_ID as string,
  AD_SIGN_IN_POLICY: process.env.REACT_APP_AD_SIGN_IN_POLICY as string,
  AD_RESET_POLICY: process.env.REACT_APP_AD_RESET_POLICY as string,
  AD_APPLICATION_ID: process.env.REACT_APP_AD_APLICATION_ID as string,
  AD_B2C_URL: process.env.REACT_APP_AD_B2C_URL as string,
  AD_SCOPES: (process.env.REACT_APP_AD_SCOPES || 'default_scope').split('|'),
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
  LAUNCH_DARKLY_CLIENT_SIDE_ID: process.env.REACT_APP_LAUNCH_DARKLY_CLIENT_SIDE_ID as string,
  LOCATION_URL: process.env.REACT_APP_LOCATION_URL as string,
  VECTOR_DATABASE_URI: process.env.REACT_APP_VECTOR_DATABASE_URI as string,
  VECTOR_DATABASE_ACCESS_TOKEN: process.env.REACT_APP_API_ACCESS_TOKEN as string,
  APP_ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT as string,
  version,
};

export default config;
