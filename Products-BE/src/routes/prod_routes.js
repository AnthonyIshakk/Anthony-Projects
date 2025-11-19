import { Router } from "express";
import { 
  getProducts,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from "../controllers/prod_controller.js";
import { requireAuth } from "../middleware/user_auth.js";
import { requirePermission } from "../middleware/require_permission.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", requireAuth, requirePermission("view_product"), getProducts);
router.get("/search", requireAuth, requirePermission("view_product"), searchProducts);
router.get("/:id", requireAuth, requirePermission("view_product"), getProductById);

router.post("/", requireAuth, requirePermission("create_product"), upload.single("image"), createProduct);

router.put("/:id", requireAuth, requirePermission("update_product"), upload.single("image"), updateProduct);

router.delete("/:id", requireAuth, requirePermission("delete_product"), deleteProduct);

export default router;
