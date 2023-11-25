import  {Express, Request, Response } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
// I have to use require because can't find it, probably because of the file's path
const pjson = require('../package.json');

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "OMEA API Docs",
            version: pjson.version
        },
         
    },
    apis: ["./src/routes/*.route.ts"]
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app: Express) => {
    console.log(`Docs available at http://${process.env.HOST}:${process.env.PORT}/api/docs`);
    app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

    app.get('docs.json', (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    })

};

export default swaggerDocs;