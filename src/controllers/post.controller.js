import { returnPostsRelatedToHashtag } from "../repositories/posts.repository.js";

export async function getPostsRelatedToHashtag(req, res) {
    const { hashtag } = req.params;

    try {
        const result = await returnPostsRelatedToHashtag(hashtag);

        res.send(result.rows);

    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function getPostsByUser(req, res) {
   
    try {

        res.send("Esta rota retorna os Post de um determinado usuario");

    } catch (err) {
        return res.status(500).send(err.message);
    }
}
