import { Router } from "express"
import { validateAuth } from "../middlewares/validateAuth.js";
import { getPostsByUser } from "../controllers/post.controller.js";


const postsRouter = Router();

postsRouter.get("/user/:id"/*, validateAuth*/, getPostsByUser);

export default postsRouter;
