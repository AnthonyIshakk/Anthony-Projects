import {Router} from "express"; 
import { getAllRoles, createRole, updateRole, deleteRole } from "../controllers/role_controller.js";
import { requireAuth } from "../middleware/user_auth.js"; 

const roleRouter = Router();

roleRouter.get("/", requireAuth, getAllRoles); 
roleRouter.post("/", requireAuth, createRole); 
roleRouter.put("/:id", requireAuth, updateRole);
roleRouter.delete("/:id", requireAuth, deleteRole);

export default roleRouter;