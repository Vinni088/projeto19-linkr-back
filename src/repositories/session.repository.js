import { db } from "../database/database.connection.js";

export function insertSession(token, userId) {
    return db.query(`INSERT INTO session (token, "userId") VALUES ($1, $2)`,
        [token, userId]);
}

export function getSessionByToken(token) {
    return db.query(`SELECT * FROM session WHERE token=$1`, [token]);
}

export function deleteSession(id) {
    return db.query(`DELETE FROM session WHERE id=$1`, [id]);
}