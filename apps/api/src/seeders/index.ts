import "../bootstraps/env.bootstrap";
import { connectDB } from "../bootstraps/db.bootstrap";
import { createAdmin } from "./admin.seeder";

await connectDB();

console.log("Seeding...");
createAdmin("aryatjiu.dev@gmail.com", "admin", "Arya Tjiutanto");