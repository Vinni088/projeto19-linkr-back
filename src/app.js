import express from "express"
import cors from "cors"
import router from "./routes/index.routes.js"
import bcrypt from "bcrypt"

const app = express()

app.use(cors())
app.use(express.json())
app.use(router)


app.get('/user/:id', async (req, res) => {
    const { id } = req.params

    try {
        const user = await db.query('SELECT * FROM USERS WHERE id = $1;', [id])
        id, name, email, password, photoUrl

        const userData = {
            name: user.rows[0].name,
            email: user.rows[0].email,
            password: user.rows[0].password,
            photoUrl: user.rows[0].photoUrl
        }

        return res.status(200).send(userData)
    } catch (error) {

    }
})

app.get('/enc/:password', (req, res) => {
    const { password } = req.params;

    res.send(bcrypt.hashSync(password, 10));
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running server on port ${PORT}`));