import { db } from "../database/database.connection.js";

export function returnTrendingHashtags() {
    return db.query(`SELECT h.name AS "hashtag" FROM "postHasHashtag" phh
        JOIN hashtag h ON h.id=phh."hashtagId"
        GROUP BY h.id
        ORDER BY COUNT(*) DESC
        LIMIT 10;`);
}

export function returnHashtagsFromPost() {
    return db.query(`
        SELECT p.id, JSON_AGG(h.name) AS hashtags 
        FROM "postHasHashtag" ph 
        JOIN post p ON p.id=ph."postId" 
        JOIN hashtag h ON h.id=ph."hashtagId"
        GROUP BY p.id;
    `);
}