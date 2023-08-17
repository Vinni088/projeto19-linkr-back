import { returnTrendingHashtags } from "../repositories/hashtag.repositories.js"

export async function getTrendingHashtags(req, res) {

    try {
        const result = await returnTrendingHashtags();

        res.send(result.rows);
        
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

