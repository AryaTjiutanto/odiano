import express from "express";
import { validateData } from "../middlewares/validateData.middleware";
import { createReport } from "@odiano/shared";
import { create } from "../controllers/report.controller";

const router = express.Router();

router.post("/create", validateData(createReport), create);

export default router;