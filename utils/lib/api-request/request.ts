'use client';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { URL_API } from 'constants/api.constant';
import ERRORS_CODE from 'assets/maps/errors-code.json';
import { ApiErrorResponse, ApiResponse, ErrorsCode, RequestOptions } from './types';

const typedErrorsCode: ErrorsCode = ERRORS_CODE as ErrorsCode;

async function apiRequest<T>(params: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
        const response: AxiosResponse<T> = await axios(params);
        return { success: true, data: response.data, message: '', error: null };
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error:', axiosError);

        const errorResponse = axiosError.response?.data as ApiErrorResponse;
        const message = errorResponse?.message || typedErrorsCode[errorResponse?.code] || 'Ocurrió un error inesperado. Contacte al administrador del sistema.';
        return { success: false, message, error: axiosError, data: null };
    }
}

async function get<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { url = URL_API, ...rest } = options;
    return await apiRequest<T>({
        url: `${url}${path}`,
        method: 'GET',
        ...rest
    });
}

async function post<T>(path: string, data: T, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { url = URL_API, ...rest } = options;
    return await apiRequest<T>({
        url: `${url}${path}`,
        method: 'POST',
        data,
        ...rest,
    });
}

async function put<T>(path: string, data: T, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { url = URL_API, ...rest } = options;
    return await apiRequest<T>({
        url: `${url}${path}`,
        method: 'PUT',
        data,
        ...rest
    });
}

async function remove<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { url = URL_API, ...rest } = options;
    return await apiRequest<T>({
        url: `${url}${path}`,
        method: 'DELETE',
        ...rest
    });
}

export {
    get,
    post,
    put,
    remove
};

const request = { get, post, put, remove };
export default request;
