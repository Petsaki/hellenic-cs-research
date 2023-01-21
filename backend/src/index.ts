import * as dotenv from "dotenv";
dotenv.config({path:'./src/env/.env'});
import Server from "./server";

const server = new Server();