import { Router } from "express"
import { signIn, signout } from "../controllers/auth.controller.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { signInSchema } from "../schemas/users.schemas.js"
import { validateAuth } from "../middlewares/validateAuth.js"

const authRouter = Router()

authRouter.post("/", validateSchema(signInSchema), signIn)
authRouter.post("/signout", validateAuth, signout)

export default authRouter
