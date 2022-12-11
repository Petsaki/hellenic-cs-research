import * as dotenv from "dotenv";
dotenv.config({path:'./src/utils/.env'});
import Server from "./models/server";

const server = new Server();