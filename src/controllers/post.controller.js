import { returnPostsRelatedToHashtag } from "../repositories/posts.repository.js";
import { db } from "../database/database.connection.js";
import { v4 as TokenGenerator } from "uuid";

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
    const { id } = req.params; //id do usuario do qual queremos os posts
    const UserId = res.locals.session.id; // id do usuario que está vendo os posts

    try {

        /* Observação: a query a seguir ainda não informa se o post em questão 
        recebu like do usuario ou não, ela retorna os posts de um determinado 
        user junto à quantidade de likes que dado post recebeu */

        const posts = (await db.query(`
        SELECT 
            post.id, post."userId", 
            (SELECT "user".username AS username FROM "user" WHERE post."userId" = $1 LIMIT 1), post.url, post.description,
            CAST(COUNT("like".*) AS INTEGER) AS "numberOfLikes"
        FROM post
            LEFT JOIN "like"
            ON "like"."postId" = post.id
        WHERE post."userId" = $1
        GROUP BY post.id
        `, [id])).rows

        let likedBy = (await db.query(`
        SELECT * FROM "like"
        WHERE "userId" = $1
        `, [UserId])).rows

        likedBy = likedBy.map(like => like.postId)
        let resposta = posts.map(post => {
            return {
                userId: post.userId,
                postId: post.id,
                postUrl: post.url,
                postOwner: post.username,
                postDescription: post.description,
                numberOfLikes: post.numberOfLikes,
                likedByViewer: (likedBy.includes(post.id) ? true : false)
            }
        })

        return res.status(200).send(resposta)
    } catch (error) {
        return res.status(500).send(error.message)
    }
};

export async function createToken(req, res) {
    let token = TokenGenerator()
    try {

        res.send(token);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function savePost(req, res) {
    const { url, description, userId } = req.body

    try {
        await db.query(`INSERT INTO post ("userId", url, description) VALUES ($1, $2, $3);`, [userId, url, description])

        res.sendStatus(200)
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function getPostsTimeline(req, res) {
    const { id } = req.params; //id do usuario do qual queremos os posts
    const UserId = res.locals.session.id; // id do usuario que está vendo os posts

    try {

        const posts = (await db.query(`
        SELECT 
            post.id, (SELECT "user".username FROM "user" WHERE "user".id = post."userId"),
            post.url, post.description,
            CAST(COUNT("like".*) AS INTEGER) AS "numberOfLikes"
        FROM post
        LEFT JOIN "like"
            ON "like"."postId" = post.id
        LEFT JOIN "user"
            ON "user".id = "post"."userId"
        GROUP BY post.id
        `)).rows

        let likedBy = (await db.query(`
        SELECT * FROM "like"
        WHERE "userId" = $1
        `, [UserId])).rows

        likedBy = likedBy.map(like => like.postId)
        let resposta = posts.map(post => {
            return {
                userId: post.userId,
                postId: post.id,
                postUrl: post.url,
                postOwner: post.username,
                postDescription: post.description,
                numberOfLikes: post.numberOfLikes,
                likedByViewer: (likedBy.includes(post.id) ? true : false)
            }
        })

        return res.status(200).send(resposta)
    } catch (error) {
        return res.status(500).send(error.message)
    }
};