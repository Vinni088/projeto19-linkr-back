import { db } from "../database/database.connection.js";

export function insertFollow(followerId, followedId) {
    return db.query(`INSERT INTO follow ("followerId", "followedId") VALUES ($1, $2);`, [followerId, followedId]);
}

export function deleteFollow(followerId, followedId) {
    return db.query(`DELETE FROM follow WHERE "followerId"=$1 AND "followedId"=$2;`, [followerId, followedId]);
}