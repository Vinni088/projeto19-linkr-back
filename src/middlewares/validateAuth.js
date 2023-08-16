// import { db } from "../database/database.connection.js"
import { getSessionByToken } from "../repositories/session.repository.js";

export async function validateAuth(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    /*console.log(token);*/

    if (!token) return res.sendStatus(401)

    try {
        /*
        const session = (await db.query(`
        SELECT users.id, users.name, users.email, sessions.token
        FROM sessions
        LEFT JOIN users
        ON users.id = sessions."userId"
        WHERE sessions.token = $1;
        `,[token])).rows[0];

        if (!session) return res.sendStatus(401)

        res.locals.session = session;
        */

        const result = await getSessionByToken(token);
        if (result.rowCount === 0) return res.sendStatus(401);

        res.locals.session = result.rows[0]; // salva a sessao dentro da resposta para consulta pela prox. função

        next();

    } catch (err) {
        return res.status(500).send(err.message);
    }
}