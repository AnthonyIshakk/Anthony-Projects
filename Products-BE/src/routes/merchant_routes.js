import { Router } from "express";
import { listMerchants } from "../controllers/merchant_controller.js";
import { requireAuth } from "../middleware/user_auth.js";

const merchantRouter = Router();

merchantRouter.get("/", requireAuth, listMerchants);

export default merchantRouter; 
