import express from "express";
import { getAllPermissions } from "../controllers/permission_controller.js"; 

const router = express.Router();

router.get("/", getAllPermissions);

export default router;
