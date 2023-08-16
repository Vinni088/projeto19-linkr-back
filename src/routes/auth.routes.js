import { Router } from "express";
import { validateAuth } from "../middlewares/validateAuth";
import { signout } from "../controllers/auth.controller";

const authRouter = Router();
authRouter.post("/signout", validateAuth, signout);

export default authRouter;