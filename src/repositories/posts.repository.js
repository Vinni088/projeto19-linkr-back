import { db } from "../database/database.connection.js";

export function returnPostsRelatedToHashtag(hashtag) {
    return db.query(`
        SELECT p.id as "postId", p.url as "postUrl", p.description as "postDescription", u.username as "postOwner", u."photoUrl", 
        (SELECT COUNT (*) FROM "like" WHERE "postId"=p.id) AS "numberOfLikes",
        (SELECT JSON_AGG(u.username) FROM "like" l JOIN "user" u ON u.id=l."userId" JOIN post p ON p.id=l."postId" WHERE p.id=ph."postId") AS "whoLiked"
            FROM "postHasHashtag" ph
                JOIN post p ON p.id=ph."postId"
                JOIN hashtag h ON h.id=ph."hashtagId"
                JOIN "user" u ON u.id=p."userId"
                WHERE h.name=$1;`, [hashtag]);
}

export function insertLike(postId, userId) {
    return db.query(`INSERT INTO "like" ("postId", "userId") VALUES ($1, $2);`, [postId, userId]);
}

export function deleteLike(postId, userId) {
    return db.query(`DELETE FROM "like" WHERE "postId"=$1 AND "userId"=$2;`, [postId, userId]);
}

export function selectLike(postId, userId) {
    return db.query(`SELECT * FROM "like" WHERE "postId"=$1 AND "userId"=$2;`, [postId, userId]);
}

export function selectPost(postId) {
    return db.query(`SELECT * FROM post WHERE id=$1;`, [postId]);
}