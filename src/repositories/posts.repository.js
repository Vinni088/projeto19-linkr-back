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