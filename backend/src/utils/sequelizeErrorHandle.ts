import { AccessDeniedError, BaseError, ConnectionError, ConnectionRefusedError, DatabaseError } from "sequelize";
import { ErrorData } from "../types";

const sequelizeErrorHandle = (error: BaseError): ErrorData => {

    // Handle bad request errors
    if (error instanceof DatabaseError) {
        let responseData: ErrorData = {code: 400, description: error.message};

        const regex = /no: (\d+)/;
        const match = (error as DatabaseError).message.match(regex);
        const sqlError = match ? match[1] : null;

        if (sqlError === '1054') {
            return {...responseData, description: 'Wrong value at Filter field.'};
        } else {
            return responseData;
        }
    }

    // Handle Internal Server Error
    // Default error code 500 and the code that sequelize provided
    let responseData: ErrorData = {code: 500, description: error.message};
    
    // Generic connection error
    if (error instanceof ConnectionError) {
        const errorMessage = "Can't connect to database. Try again later!";
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