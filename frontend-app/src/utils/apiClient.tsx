import axios, { AxiosRequestConfig } from 'axios';
import config from '../config/environment.config';
import qs from 'qs';

interface ApiRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  body?: any;
  params?: Record<string, any>;
}

const apiClient = async ({ method, endpoint, body, params }: ApiRequestOptions) => {
  const url = `${config.VECTOR_DATABASE_URI}/${endpoint}`;
  const paramsWithAccessToken = {
    code: config.VECTOR_DATABASE_ACCESS_TOKEN.replace(/'/g, ''),
    env: config.APP_ENVIRONMENT,
    ...params,
  };

  const axiosConfig: AxiosRequestConfig = {
    method,
    url,
    data: body,
    params: paramsWithAccessToken,
    paramsSerializer: (params) => qs.stringify(params, { encode: false }), // Custom parameter serialization
  };

  try {
    const response = await axios(axiosConfig);
    return response.data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

export default apiClient;
