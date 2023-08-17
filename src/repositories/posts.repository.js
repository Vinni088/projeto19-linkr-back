import { db } from "../database/database.connection.js";

export function returnPostsRelatedToHashtag(hashtag) {
    return db.query(`SELECT p.* FROM "postHasHashtag" ph
        JOIN post p ON p.id=ph."postId"
        JOIN hashtag h ON h.id=ph."hashtagId"
        WHERE h.name=$1;`, [hashtag]);
}