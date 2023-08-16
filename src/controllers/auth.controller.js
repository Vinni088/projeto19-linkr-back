import { db } from "../database/database.connection.js"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"

export async function signIn(req, res) {
    const { email, password } = req.body

    try {
        const userInfo = await db.query(`SELECT * FROM user WHERE email = $1;`, [email])
        if (userInfo.rowCount === 0) return res.sendStatus(401)

        const correctPassword = bcrypt.compareSync(password, userInfo.rows[0].password)
        if (!correctPassword) return res.sendStatus(401)

        const token = uuid()
        await db.query(`INSERT INTO session ("userId", token) VALUES ($1, $2);`, [userInfo.rows[0].id, token])
        res.status(200).send({ token, userId: userInfo.rows[0].id })
    } catch (err) {
        return res.status(500).send(err.message)
    }
}