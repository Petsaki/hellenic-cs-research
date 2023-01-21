import { AccessDeniedError, BaseError, ConnectionError, ConnectionRefusedError } from "sequelize";
import { ErrorData } from "../types";

const sequelizeErrorHandle = (error: BaseError): ErrorData => {
    // Default error code 500 and the code that sequelize provided
    let responseData: ErrorData = {code: 500, description: error.message};
    // Generic connection error
    if (error instanceof ConnectionError) {
        const errorMessage = "Server can't handle your request. Try again later!";
        // Can't find the database
        if (error instanceof ConnectionRefusedError) {
            console.log("Database is down or doesn't exist");   
        // Database exists but didn't connect because of wrong parameters
        } else if (error instanceof AccessDeniedError) {
            console.log("Can't connect to database because of wrong parameters");
        }
        // 503 error for all connection problems with database
        return {code: 503, description: errorMessage};
    }
    return responseData;
}

export default sequelizeErrorHandle;