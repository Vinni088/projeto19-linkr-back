import { Router } from "express"
import { validateAuth } from "../middlewares/validateAuth.js";
import { getPostsByUser, createToken, savePost } from "../controllers/post.controller.js";


const postsRouter = Router();

postsRouter.get("/posts/user/:id", validateAuth, getPostsByUser);
postsRouter.get("/createToken", createToken)
postsRouter.post("/timeline", validateAuth, savePost)

export default postsRouter;
