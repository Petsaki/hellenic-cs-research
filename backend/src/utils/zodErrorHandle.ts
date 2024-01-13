import { ZodError } from "zod";
import { ErrorData } from "../types";
import { fromZodError } from 'zod-validation-error';

const zodErrorHandle = (error: ZodError): ErrorData => {
    const validationError = fromZodError(error);
    
    // Using zod-validation-error to output user friendly error messages
    return {code: 400, description: validationError.message} as ErrorData;
}

export default zodErrorHandle;