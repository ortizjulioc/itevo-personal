import { AxiosError } from "axios";

export interface ErrorsCode {
    [key: string]: string;
}

export interface ApiErrorResponse {
    code: string;
    message?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    message: string;
    error: AxiosError | null;
}

export interface RequestOptions {
    url?: string;
    data?: any;
}
