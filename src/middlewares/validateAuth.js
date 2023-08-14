import { db } from "../database/database.connection.js"

export async function validateAuth(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    /*console.log(token);*/

    if (!token) return res.sendStatus(401)

    try {
        const session = (await db.query(`
        SELECT users.id, users.name, users.email, sessions.token
        FROM sessions
        LEFT JOIN users
        ON users.id = sessions."userId"
        WHERE sessions.token = $1;
        `,[token])).rows[0];

        if (!session) return res.sendStatus(401)

        res.locals.session = session;

        next();

    } catch (err) {
        return res.status(500).send(err.message);
    }
}