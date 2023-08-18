import { Router } from "express"
import { signIn, signout, checkLogin, getUsers, signUp } from "../controllers/auth.controller.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { signInSchema, signUpSchema } from "../schemas/users.schemas.js"
import { validateAuth } from "../middlewares/validateAuth.js"

const authRouter = Router()

authRouter.post("/signup", validateSchema(signUpSchema), signUp)
authRouter.post("/", validateSchema(signInSchema), signIn)
authRouter.post("/signout", validateAuth, signout)
authRouter.post("/checkLogin", checkLogin)
authRouter.get("/user/:id", getUsers)

export default authRouter
