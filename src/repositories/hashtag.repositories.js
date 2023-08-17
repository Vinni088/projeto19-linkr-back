import { db } from "../database/database.connection.js";

export function returnTrendingHashtags() {
    return db.query(`SELECT h.name AS "hashtag" FROM "postHasHashtag" phh
        JOIN hashtag h ON h.id=phh."hashtagId"
        GROUP BY h.id
        ORDER BY COUNT(*) DESC
        LIMIT 10;`);
}