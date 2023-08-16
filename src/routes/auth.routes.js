import { Router } from "express";
import { validateAuth } from "../middlewares/validateAuth.js";
import { signout } from "../controllers/auth.controller.js";

const authRouter = Router();
authRouter.post("/signout", validateAuth, signout);
// teste

export default authRouter;