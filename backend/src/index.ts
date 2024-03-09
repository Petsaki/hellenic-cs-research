import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({path: path.resolve(__dirname, "../.env")});
import Server from "./server";

new Server();
