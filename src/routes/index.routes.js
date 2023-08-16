import { Router } from "express";
import usersRouter from "./user.routes.js";

const router = Router();

router.use(usersRouter);

export default router;
