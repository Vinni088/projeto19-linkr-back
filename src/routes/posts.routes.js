import { Router } from "express"
import { validateAuth } from "../middlewares/validateAuth.js";
import { getPostsByUser, createToken } from "../controllers/post.controller.js";


const postsRouter = Router();

postsRouter.get("/posts/user/:id", validateAuth, getPostsByUser);
postsRouter.get("/createToken", createToken)

export default postsRouter;
