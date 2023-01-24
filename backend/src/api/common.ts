import { ResponseData } from "../types";

export function sendResponse<T>(code: number, description: string, data?: T): ResponseData<T> {

    let response: ResponseData<T> = {
        code,
        data,
        description,
        success: setSuccess(code),
    }

    return response;
}

function setSuccess(code: number): boolean {
    if (code === 200) {
        return true;
    } else {
        return false;
    }
}