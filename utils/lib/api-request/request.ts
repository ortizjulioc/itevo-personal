'use client';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import ERRORS_CODE from 'assets/maps/errors-code.json';
import { ApiErrorResponse, ApiResponse, ErrorsCode, RequestOptions } from './types';

const typedErrorsCode: ErrorsCode = ERRORS_CODE as ErrorsCode;

async function apiRequest<T>(params: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
        const response: AxiosResponse<T> = await axios(params);
        return { success: true, data: response.data, message: '', error: null };
    } catch (error) {
        const axiosError = error as AxiosError;
        const url = axiosError.config?.url;
        const status = axiosError.response?.status;
        const responseData = axiosError.response?.data;
        console.error(`[API Error] ${status} ${url}`, responseData);

        const errorResponse = axiosError.response?.data as ApiErrorResponse;
        const message = errorResponse?.message || typedErrorsCode[errorResponse?.code] || errorResponse?.error || `Error ${status}: ${url} - Contacte al administrador del sistema.`;
        return { success: false, message, error: axiosError, data: null };
    }
}

async function get<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { params, ...restOptions } = options;
    return await apiRequest<T>({
        ...restOptions,
        params,
        url: `/api/${path}`,
        method: 'GET',
    });
}

async function post<T>(path: string, data: T, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return await apiRequest<T>({
        url: `/api/${path}`,
        ...options,
        method: 'POST',
        data,
    });
}

async function put<T>(path: string, data: T, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return await apiRequest<T>({
        url: `/api/${path}`,
        ...options,
        method: 'PUT',
        data,
    });
}

async function remove<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return await apiRequest<T>({
        ...options,
        url: `/api/${path}`,
        method: 'DELETE',
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
