import express from "express";
import { validateData } from "../middlewares/validateData.middleware";
import { createReport } from "@odiano/shared";
import { create, getAll, process, takeAction } from "../controllers/report.controller";

const router = express.Router();

router.get("/", getAll);
router.post("/create", validateData(createReport), create);
router.patch("/:id/process", process);
router.patch("/:id/take-action", takeAction);

export default router;