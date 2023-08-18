import { Router } from "express";
import usersRouter from "./user.routes.js";
import authRouter from "./auth.routes.js";
import postsRouter from "./posts.routes.js";
import hashtagRouter from "./hashtag.routes.js";

const router = Router();
router.use(usersRouter);
router.use(authRouter);
router.use(hashtagRouter);
router.use(postsRouter)


export default router;
