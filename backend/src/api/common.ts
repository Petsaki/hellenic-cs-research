import { ResponseData } from "../types";

export function sendResponse<T>(code: number, description: string, data?: T): ResponseData<T> {

    return {
        code: code,
        data: data,
        description: description,
        success: code === 200,
    }
}