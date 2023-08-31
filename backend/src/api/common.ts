import { ResponseData } from "../types";

export function sendResponse<T>(code: number, description: string, data?: T): ResponseData<T> {

    return {
        code,
        data,
        description,
        success: code === 200,
    }
}