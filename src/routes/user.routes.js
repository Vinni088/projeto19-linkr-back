import { Router } from "express"
import { getUsers, searchUsers, signUp, getUserById, followUser, unFollowUser } from "../controllers/user.controller.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { signUpSchema } from "../schemas/users.schemas.js"
import { validateAuth } from "../middlewares/validateAuth.js"

const usersRouter = Router()

usersRouter.post("/signup", validateSchema(signUpSchema), signUp)
usersRouter.get("/autenticated-user", validateAuth, getUsers);
usersRouter.post("/search-users", validateAuth, searchUsers)
usersRouter.get("/user/:id", validateAuth, getUserById);
usersRouter.post("/user/:id/follow", validateAuth, followUser);
usersRouter.post("/user/:id/unfollow", validateAuth, unFollowUser);




export default usersRouter