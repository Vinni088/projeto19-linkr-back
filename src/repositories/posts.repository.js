import { db } from "../database/database.connection.js";

export function returnPostsRelatedToHashtag(hashtag) {
    return db.query(`
        SELECT p.id, p.url, p.description, u.username, u."photoUrl", 
        (SELECT COUNT (*) FROM "like" WHERE "postId"=p.id) AS "likeCount",
        (SELECT JSON_AGG(u.username) FROM "like" l JOIN "user" u ON u.id=l."userId" JOIN post p ON p.id=l."postId" WHERE p.id=ph."postId") AS "whoLikedList"
            FROM "postHasHashtag" ph
                JOIN post p ON p.id=ph."postId"
                JOIN hashtag h ON h.id=ph."hashtagId"
                JOIN "user" u ON u.id=p."userId"
                WHERE h.name=$1;`, [hashtag]);
}