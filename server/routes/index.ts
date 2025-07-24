import { Router } from "express";
import userRoutes from "./users";
import catsRoutes from "./cats";
import notificationRoutes from "./notifications";

const router = Router();

router.use("/users", userRoutes);
router.use("/cats", catsRoutes);
router.use("/notifications", notificationRoutes);

export default router;
