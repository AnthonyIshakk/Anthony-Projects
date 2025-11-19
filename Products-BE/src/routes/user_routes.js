import { Router } from "express";
import { register, login, getProfile } from "../controllers/user_controller.js";
import { requireAuth } from "../middleware/user_auth.js";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/profile", requireAuth, getProfile); 

export default userRouter;
