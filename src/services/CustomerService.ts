import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosInstance from './APIService';
import { getAccessToken } from '@/utils/token';

class CustomerService {
   API: any;
   constructor(baseURL = '/api/customers') {
      this.API = axiosInstance(baseURL);
      this.API.interceptors.request.use(
         async (config: AxiosRequestConfig) => {
            if (config.url) {
               if (
                  config.url.indexOf('/login') >= 0 ||
                  config.url.indexOf('/create-new-access-token') >= 0
               ) {
                  return config;
               }
            }

            const token = await getAccessToken();
            if (config.headers) {
               config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
         },
         (error: AxiosError) => {
            console.log(error);
            return Promise.reject(error);
         }
      );

      this.API.interceptors.response.use(
         async (response: AxiosResponse) => {
            const config = response.config;
            if (config.url) {
               if (
                  config.url.indexOf('/login') >= 0 ||
                  config.url.indexOf('/create-new-access-token') >= 0
               ) {
                  return response;
               }
            }

            return response;
         },
         async (error: AxiosError) => {
            const originalRequest = error.config;
            const errorResponse = error.response;
            // if (
            //    errorResponse.data.message === 'Invalid access token!' &&
            //    errorResponse.status === 401
            // ) {
            //    const newAccessToken = (await TokenService.getNewAccessToken())
            //       .accessToken;
            //    await setAccessToken(newAccessToken);

            //    return new Promise((resolve, reject) => {
            //       originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            //       resolve(this.API(originalRequest));
            //       reject(error);
            //    });
            // }
            return Promise.reject(error);
         }
      );
   }

   async getAllCustomers() {
      return (await this.API.get('/')).data;
   }

   async create(data: any) {
      return (await this.API.post('/', data)).data;
   }

   async getCustomer(id: string) {
      return (await this.API.get(`/${id}`)).data;
   }

   async updateCustomer(id: string, data: any) {
      return (await this.API.put(`/${id}`, data)).data;
   }

   async deleteCustomer(id: string) {
      return (await this.API.delete(`/${id}`)).data;
   }
}

export default new CustomerService();
