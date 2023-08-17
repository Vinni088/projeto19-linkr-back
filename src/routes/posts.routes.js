import { Router } from "express"
import { getPostsByUser } from "../controllers/post.controller";


const postsRouter = Router();

postsRouter.get("/user/:id", getPostsByUser);

export default postsRouter;
