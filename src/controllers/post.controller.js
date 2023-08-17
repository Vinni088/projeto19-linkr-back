import { returnPostsRelatedToHashtag } from "../repositories/posts.repository.js";
import { db } from "../database/database.connection.js";

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
    const { id } = req.params ; //id do usuario do qual queremos os posts
    /*const UserId = res.locals.session.id;*/ // id do usuario que está vendo os posts

    try {

        /* Observação: a query a seguir ainda não informa se o post em questão 
        recebu like do usuario ou não, ela retorna os posts de um determinado 
        user junto à quantidade de likes que dado post recebeu */

        const posts = await db.query(`
        SELECT 
            post.id, post."userId", post.url, post.description,
            CAST(COUNT("like".*) AS INTEGER) AS "numberOfLikes"
        FROM post
            LEFT JOIN "like"
            ON "like"."postId" = post.id
        WHERE post."userId" = $1
        GROUP BY post.id
        `, [id])

        const postData = posts.rows

        return res.status(200).send(postData)
    } catch (error) {
        return res.status(500).send(error.message)
    }
};
