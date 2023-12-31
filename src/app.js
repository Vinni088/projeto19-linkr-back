import express from "express"
import cors from "cors"
import router from "./routes/index.routes.js"
import bcrypt from "bcrypt"

const app = express()

app.use(cors())
app.use(express.json())
app.use(router)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running server on port ${PORT}`));