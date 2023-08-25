import { Router } from "express"
import { validateAuth } from "../middlewares/validateAuth.js";
import { getPostsByUser, getPostsTimeline, savePost, updatePost, deletePost, addRepost, addComment, dislikePost, likePost } from "../controllers/post.controller.js";


const postsRouter = Router();

postsRouter.get("/posts/timeline", validateAuth, getPostsTimeline);
postsRouter.get("/posts/user/:id", validateAuth, getPostsByUser);

postsRouter.post("/timeline", validateAuth, savePost);
postsRouter.post("/respost/:postId", validateAuth, addRepost);
postsRouter.post("/post/:postId/comment", validateAuth, addComment)

postsRouter.put("/post/:postId", validateAuth, updatePost);
postsRouter.delete("/post/:postId", validateAuth, deletePost);
postsRouter.post("/post/:postId/like", validateAuth, likePost);
postsRouter.post("/post/:postId/dislike", validateAuth, dislikePost);


export default postsRouter;
