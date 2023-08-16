import { Router } from "express"
import { signIn } from "../controllers/auth.controller.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { signInSchema } from "../schemas/users.schemas.js"

const authRouter = Router()

authRouter.post("/", validateSchema(signInSchema), signIn)

export default authRouter