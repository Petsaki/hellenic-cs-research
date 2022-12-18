import { ResponseData } from "../types";

export function sendResponse<T>(code: number, description: string,
    success: boolean, data?: T) : ResponseData<T> {

    let response: ResponseData<T> = {
        code: code,
        data: data,
        description: description,
        success: success,
    }

    return response;
}