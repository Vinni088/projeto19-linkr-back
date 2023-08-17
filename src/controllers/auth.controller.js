import { db } from "../database/database.connection.js"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import { deleteSession } from "../repositories/session.repository.js";

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

export async function signout(req, res) {
    const { id } = res.locals.session;

    try {

        await deleteSession(id);

        res.sendStatus(200);
    } catch (err) {

        res.status(500).send(err.message);
    }
}

export async function checkLogin(req, res) {
    const { token } = req.body

    try {
        let usuario = (await db.query(`
        SELECT 
        session.token, "user".id, "user".email,
        "user".username, "user"."photoUrl"
        FROM session
        LEFT JOIN "user" ON "user".id = session."userId" 
        WHERE session.token = $1
        `,[token])).rows

        if (usuario.length === 0) {
            return res.status(401).send(" O token enviado é invalido ou nulo. ")
        }

        res.send(sessions);
    } catch (err) {

        res.status(500).send(err.message);
    }
}