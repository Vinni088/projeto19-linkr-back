import express from "express"
import cors from "cors"
import router from "./routes/index.routes.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use(router)



app.get("/timeline", async (req, res) => {

    ///token pode vir pelo header
    if (!token) {
        console.log("UNAUTHORIZED! TOKEN IS MISSING!")
        return res.status(409).send("UNAUTHORIZED! TOKEN IS MISSING!")
    }


    try {

        //ordena todos os posts do id mais antigo para o mais atual
        const posts = await db.query('SELECT * FROM POST ORDER BY id DESC LIMIT 20;')

        console.log("GET POSTS SUCCESS")

        if (posts.rows.length < 1) {

            const postData = {message: 'There are no posts yet'}

            return res.status(200).send(postData)

        } else {
            return res.status(200).send(posts.rows)
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(error.message)
    }

})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running server on port ${PORT}`));