import { Router } from "express"
import { getUsers, searchUsers, signUp, getUserById } from "../controllers/user.controller.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { signUpSchema } from "../schemas/users.schemas.js"
import { validateAuth } from "../middlewares/validateAuth.js"

const usersRouter = Router()

usersRouter.post("/signup", validateSchema(signUpSchema), signUp)
usersRouter.get("/autenticated-user", validateAuth, getUsers);
usersRouter.post("/search-users", searchUsers)
usersRouter.get("/user/:id", validateAuth, getUserById);




export default usersRouter