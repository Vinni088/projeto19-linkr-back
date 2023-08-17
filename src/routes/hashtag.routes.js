import { Router } from "express"
import { getTrendingHashtags } from "../controllers/hashtag.controller.js";
import { getPostsRelatedToHashtag } from "../controllers/post.controller.js";

const hashtagRouter = Router();

hashtagRouter.get("/trending", getTrendingHashtags);
hashtagRouter.get("/hashtag/:hashtag", getPostsRelatedToHashtag);

export default hashtagRouter;
