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
    const UserId = res.locals.session.userId; // id do usuario que está vendo os posts

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

        let hashtags = await db.query(`
        SELECT JSON_AGG(h.name) AS hashtags 
            FROM "postHasHashtag" ph 
            JOIN post p ON p.id=ph."postId" 
            JOIN hashtag h ON h.id=ph."hashtagId"
			WHERE p."userId"=$1
            GROUP BY p.id;`, [id]);

        const mappedHashtags = hashtags.rows.map(o => o.hashtags);

        let whoLiked = await db.query(`
        SELECT JSON_AGG(u.username) as "whoLiked" FROM "like" l
            JOIN post p ON p.id=l."postId"
            JOIN "user" u ON u.id=l."userId"
            WHERE p."userId"=$1
            GROUP BY p.id;`, [id]);

        const mappedWhoLiked = whoLiked.rows.map(o => o.whoLiked);

        console.log(whoLiked.rows);

        likedBy = likedBy.map(like => like.postId)
        let resposta = posts.map((post, index) => {
            return {
                userId: post.userId,
                postId: post.id,
                postUrl: post.url,
                postOwner: post.username,
                postDescription: post.description,
                numberOfLikes: post.numberOfLikes,
                hashtags: mappedHashtags[index],
                whoLiked: mappedWhoLiked[index],
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
    //const { id } = req.params; //id do usuario do qual queremos os posts
    const UserId = res.locals.session.userId; // id do usuario que está vendo os posts

    try {

        const posts = await db.query(`
            SELECT 
                post.id, (SELECT "user".username FROM "user" WHERE "user".id = post."userId"),
                post.url, post.description,
                CAST(COUNT("like".*) AS INTEGER) AS "numberOfLikes"
            FROM post
            LEFT JOIN "like"
                ON "like"."postId" = post.id
            LEFT JOIN "user"
                ON "user".id = "post"."userId"
            LEFT JOIN follow
                ON follow."followerId"="user".id
            WHERE "user".id IN (select "followedId" from follow WHERE "followerId"=$1) OR "user".id=$1
            GROUP BY post.id;`, [UserId]);

        let likedBy = (await db.query(`
        SELECT * FROM "like"
        WHERE "userId" = $1
        `, [UserId])).rows

        let hashtags = await db.query(`
        SELECT JSON_AGG(h.name) AS hashtags 
            FROM "postHasHashtag" ph 
            JOIN post p ON p.id=ph."postId" 
            JOIN hashtag h ON h.id=ph."hashtagId"
			WHERE p."userId"=$1
            GROUP BY p.id;`, [UserId]);

            
        const mappedHashtags = hashtags.rows.map(o => o.hashtags);

        let whoLiked = await db.query(`
        SELECT JSON_AGG(u.username) as "whoLiked" FROM "like" l
            JOIN post p ON p.id=l."postId"
            JOIN "user" u ON u.id=l."userId"
            WHERE p."userId"=$1
            GROUP BY p.id;`, [UserId]);

            console.log(posts);

        const mappedWhoLiked = whoLiked.rows.map(o => o.whoLiked);

        likedBy = likedBy.map(like => like.postId)
        let resposta = posts.rows.map((post, index) => {
            return {
                userId: post.userId,
                postId: post.id,
                postUrl: post.url,
                postOwner: post.username,
                postDescription: post.description,
                numberOfLikes: post.numberOfLikes,
                hashtags: mappedHashtags[index],
                whoLiked: mappedWhoLiked[index],
                likedByViewer: (likedBy.includes(post.id) ? true : false)
            }
        })

        return res.status(200).send(resposta)
    } catch (error) {
        return res.status(500).send(error.message)
    }
};

export async function updatePost(req, res) {
    const { postId } = req.params; //id do usuario do qual queremos os posts
    const UserId = res.locals.session.userId; // id do usuario que está vendo os posts
    const { url, description } = req.body;
    try {
        let postPreExistente = (await db.query(` SELECT * FROM post WHERE id = $1`, [postId]))

        if (postPreExistente.rowCount === 0) {
            return res.status(404).send("There isn't a post with this id.")
        }

        if (postPreExistente.rows[0].userId !== UserId) {
            return res.status(401).send("This post doesn't belong to this user.")
        }

        let insert = await db.query(`
        UPDATE
            "post"
        SET
            (url,description) = 
            ($1, $2)
        WHERE
            id = $3
        `, [url, description, postId])

        return res.status(200).send(`Post updated.`)
    } catch (error) {
        return res.status(500).send(error.message)
    }
    /*
    "url": "https://blog.cobasi.com.br/como-plantar-goiaba/",
    "description": "Planos Pro fim de Semana!",
    */
};

export async function deletePost(req, res) {
    const { postId } = req.params; //id do usuario do qual queremos os posts
    const UserId = res.locals.session.userId; // id do usuario que está vendo os posts

    try {
        let postPreExistente = (await db.query(` SELECT * FROM post WHERE id = $1`, [postId]))

        if (postPreExistente.rowCount === 0) {
            return res.status(404).send("There isn't a post with this id.")
        }

        if (postPreExistente.rows[0].userId !== UserId) {
            return res.status(401).send("This post doesn't belong to this user.")
        }
        let deleteHashtags = await db.query(`
        DELETE FROM "postHasHashtag" WHERE "postId" = $1;
        `, [postId])
        let deleteLikes = await db.query(`
        DELETE FROM "like" WHERE "postId" = $1;
        `, [postId])
        let deletePost = await db.query(`
        DELETE FROM "post" WHERE "id" = $1;
        `, [postId])

        return res.status(200).send(`Post deleted.`)
    } catch (error) {
        return res.status(500).send(error.message)
    }
    /*
    "url": "https://blog.cobasi.com.br/como-plantar-goiaba/",
    "description": "Planos Pro fim de Semana!",
    */
};