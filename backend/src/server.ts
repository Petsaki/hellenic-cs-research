import express, { Application, Request, Response } from 'express';
import routesDepartment from './routes/department.route';
import cors from 'cors';
import db from './db/connection';

class Server {
    private app = express();
    private port: number;
    private host: string;

    constructor() {
        this.port = (process.env.PORT || 8888) as number;
        this.host = process.env.HOST || 'localhost'
        this.listen();
        this.middlewares();
        this.routes();
        this.dbConnect();
    }

    // Listens for a connection
    listen(): void {
        this.app.listen(this.port,this.host, (): void => {
            console.log(`Application runs at host: ${this.host} and port: ${this.port}`);
        });
    }

    // Handles all endpoints
    routes(): void {
        this.app.get('/', (req: Request, res: Response): void => {
            res.json({
                msg: "It's all good man!"
            });
        });
        this.app.use('/api/departments', routesDepartment);
    }

    middlewares(): void {
        // Parse the body
        this.app.use(express.json());

        // Cors
        this.app.use(cors());
    }

    // Checks if the connection at database was successful or not
    async dbConnect(): Promise<void> {
        try {
            await db.authenticate();
            console.log('Connected to the database!');
        } catch (error) {
            console.log(error);
            console.log('Error: did not connect to the database.');
        }
    }
}

export default Server;