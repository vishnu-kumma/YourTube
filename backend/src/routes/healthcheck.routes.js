import express from "express";
import { healthcheck } from "../controllers/healthcheck.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get("/", verifyJWT, healthcheck);

export default router;