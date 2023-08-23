import { Router } from "express"
import { validateAuth } from "../middlewares/validateAuth.js";
import { getPostsByUser, getPostsTimeline, savePost, updatePost, deletePost, addRepost } from "../controllers/post.controller.js";


const postsRouter = Router();

postsRouter.get("/posts/timeline", validateAuth, getPostsTimeline)
postsRouter.get("/posts/user/:id", validateAuth, getPostsByUser);
postsRouter.post("/timeline", validateAuth, savePost)
postsRouter.put("/post/:postId", validateAuth, updatePost)
postsRouter.delete("/post/:postId", validateAuth, deletePost)
postsRouter.post("/respost/:postId", validateAuth, addRepost)
export default postsRouter;
