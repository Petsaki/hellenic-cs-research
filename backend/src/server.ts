import express, { Application, Request, Response } from 'express';
import routesDepartment from './routes/department.route';
import routesPublications from './routes/publications.route';
import routesAcademicStaff from './routes/academic-staff.route';
import cors from 'cors';
import db from './db/connection';
import errorHandler from './middlewares/errorHandler';
import { runAssociations } from './models/associations';
import { tryCatch } from './utils/tryCatch';
import { cacheData } from './types';

class Server {
    private app = express();
    private port: number;
    private host: string;

    constructor() {
        this.port = (process.env.PORT || 8888) as number;
        this.host = process.env.HOST || 'localhost'
        this.listen();
        this.routes();
        this.dbConnect();
        // IMPORTANT: middlewares must be after routes!! Routes are middlewares too.
        this.middlewares();
        runAssociations();
    }

    // Listens for a connection
    listen(): void {
        this.app.listen(this.port,this.host, (): void => {
            console.log(`Application runs at host: ${this.host} and port: ${this.port}`);
        });
    }

    // Handles all endpoints
    routes(): void {
        // Parse the body
        this.app.use(express.json());

        // Cors must be before any route
        // Cors
        this.app.use(cors());

        this.app.get('/', (req: Request, res: Response): void => {
            res.json({
                msg: "It's all good man!"
            });
        });
        this.app.use('/api/departments', routesDepartment);
        this.app.use('/api/publications', routesPublications);
        this.app.use('/api/academic-staff', routesAcademicStaff);
    }

    middlewares(): void {
        // Handle errors
        // Must be at the end of middlewares
        this.app.use(errorHandler);
    }

    // Checks if the connection at database was successful or not
    async dbConnect(): Promise<void> {
        try {
            await db.authenticate();
            console.log('Connected to the database!');
        } catch {
            // Sequelize will handle the reconnect by itself.
            console.log('Unable to connect to the database.');
        }
    }
}

export default Server;

// Cache
export const cacheTime = 1_800_000 // cache for 30 minutes

export const reqCache: cacheData = {
    position: [],
    yearsRange: [],
    departmentsID: []
};