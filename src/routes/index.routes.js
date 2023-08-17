import { Router } from "express";
import authRouter from "./auth.routes.js";
import hashtagRouter from "./hashtag.routes.js";

const router = Router();

router.use(authRouter);
router.use(hashtagRouter);

export default router;
