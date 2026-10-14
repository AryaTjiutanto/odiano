import "../bootstraps/env.bootstrap.js";
import { connectDB } from "../bootstraps/db.bootstrap.js";
import { createAdmin } from "./admin.seeder.js";

await connectDB();

console.log("Seeding...");
