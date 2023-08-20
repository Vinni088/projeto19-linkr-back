// import { db } from "../database/database.connection.js"
import { getSessionByToken } from "../repositories/session.repository.js";

export async function validateAuth(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) return res.sendStatus(401)

    try {
        const result = await getSessionByToken(token);
        if (result.rowCount === 0) return res.sendStatus(401);
        /*console.log(result.rows[0]);*/

        res.locals.session = result.rows[0]; // salva a sessao dentro da resposta para consulta pela prox. função

        next();

    } catch (err) {
        return res.status(500).send(err.message);
    }
}