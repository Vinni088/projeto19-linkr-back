import { Router } from "express"
import { getUsers, signUp } from "../controllers/user.controller.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { signUpSchema } from "../schemas/users.schemas.js"

const usersRouter = Router()

usersRouter.post("/signup", validateSchema(signUpSchema), signUp)
usersRouter.get("/user/:id", getUsers)

export default usersRouter