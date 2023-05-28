import { z, ZodError } from "zod";
import { ErrorData } from "../types";
import { fromZodError } from 'zod-validation-error';

const zodErrorHandle = (error: ZodError): ErrorData => {
    // console.log(error);
    const validationError = fromZodError(error);
    console.log(validationError.message);
    
    // Using zod-validation-error to output user friendly error messages
    return {code: 400, description: validationError.message} as ErrorData;
}

// const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
//     console.log('dhladh auto trexei twra?');
    
//     if (issue.code === z.ZodIssueCode.invalid_type) {
//       if (issue.expected === "string") {
//         return { message: "bad type!" };
//       }
//     }
//     return { message: ctx.defaultError };
//   };
  
//   z.setErrorMap(customErrorMap);

export default zodErrorHandle;