import { deleteLike, insertLike, returnPostsRelatedToHashtag, selectLike, selectPost } from "../repositories/posts.repository.js";
import { db } from "../database/database.connection.js";
import { v4 as TokenGenerator } from "uuid";
import { returnHashtagsFromPost } from "../repositories/hashtag.repositories.js";

export async function likePost(req, res) {
    const { postId } = req.params;
    const { userId } = res.locals.session;

    try {
        const result = await selectPost(postId);
        if (result.rowCount === 0) return res.status(404).send({message: "Post do not exists!"});

        const result2 = await selectLike(postId, userId);
        if (result2.rowCount === 1) return res.status(409).send({message: "The post has been liked by you already!"});

        await insertLike(postId, userId);
        res.send(201);

    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function dislikePost(req, res) {
    const { postId } = req.params;
    const { userId } = res.locals.session;

    try {
        const result = await selectPost(postId);
        if (result.rowCount === 0) return res.status(404).send({message: "Post do not exists!"});

        const result2 = await selectLike(postId, userId);
        if (result2.rowCount === 0) return res.status(409).send({message: "The post has not been liked by you yet!"});

        await deleteLike(postId, userId);
        res.send(204);

    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function getPostsRelatedToHashtag(req, res) {
    const { hashtag } = req.params;

    try {
        const result = await returnPostsRelatedToHashtag(hashtag);
        const result2 = await returnHashtagsFromPost();

        const transformedResult = result.rows.map(r => {
            const matchRow = result2.rows.find(row => row.id === r.postId);
            return { ...r, hashtags: matchRow.hashtags }
        });

        res.send(transformedResult);

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
            post.id, (SELECT "user".username FROM "user" WHERE "user".id = post."userId"),
            (SELECT "user"."photoUrl" FROM "user" WHERE "user".id = post."userId"),
            post.url, post.description,
            CAST(COUNT("like".*) AS INTEGER) AS "numberOfLikes",
            CAST(COUNT("rePost".*) AS INTEGER) AS "numberOfReposts",
            CAST(COUNT("comments".*) AS INTEGER) AS "numberOfComments",
            JSON_AGG(JSON_BUILD_OBJECT(
                'id', "comments".id,
                'commentary', "comments"."comment",
                'commentatorName', (SELECT "user".username FROM "user" WHERE "user".id = "comments"."userId"),
                'commentatorPfp', (SELECT "user"."photoUrl" FROM "user" WHERE "user".id = "comments"."userId")
              ) ORDER BY "comments".id) AS "Comments"
        FROM post
        LEFT JOIN  "like"
            ON "like"."postId" = post.id
        LEFT JOIN "user"
            ON "user".id = "post"."userId"
        LEFT JOIN  "rePost"
            ON "rePost"."postId" = "post"."id"
        LEFT JOIN  "comments"
            ON "comments"."postId" = "post"."id"
        WHERE "post"."userId"=$1
        GROUP BY post.id
        ORDER BY post.id
        `, [id])).rows

        let likedBy = (await db.query(`
        SELECT * FROM "like"
        WHERE "userId" = $1
        `, [UserId])).rows
        likedBy = likedBy.map(like => like.postId)

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

        let resposta = posts.map((post, index) => {
            return {
                userId: post.userId,
                postId: post.id,
                postUrl: post.url,
                postOwner: post.username,
                postOwnerPicture: post.photoUrl,
                postDescription: post.description,
                numberOfLikes: post.numberOfLikes,
                numberOfReposts: post.numberOfReposts,
                numberOfComments: post.numberOfComments,
                Comments: post.Comments,
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
    const UserId = res.locals.session.userId; // id do usuario que está vendo os posts

    try {

        const posts = (await db.query(`
        SELECT 
            post.id, post.url, post.description,
            (SELECT "user".username FROM "user" WHERE "user".id = post."userId"),
            (SELECT "user"."photoUrl" FROM "user" WHERE "user".id = post."userId"),
            CAST(COUNT("like".*) AS INTEGER) AS "numberOfLikes",
            CAST(COUNT("rePost".*) AS INTEGER) AS "numberOfReposts",
            CAST(COUNT("comments".*) AS INTEGER) AS "numberOfComments",
            JSON_AGG(JSON_BUILD_OBJECT(
                'id', "comments".id,
                'commentary', "comments"."comment",
                'commentatorName', (SELECT "user".username FROM "user" WHERE "user".id = "comments"."userId"),
                'commentatorPfp', (SELECT "user"."photoUrl" FROM "user" WHERE "user".id = "comments"."userId")
              ) ORDER BY "comments".id) AS "Comments"
        FROM post
        LEFT JOIN  "like"
            ON "like"."postId" = post.id
        LEFT JOIN "user"
            ON "user".id = "post"."userId"
        LEFT JOIN  "rePost"
            ON "rePost"."postId" = "post"."id"
        LEFT JOIN  "comments"
            ON "comments"."postId" = "post"."id"
        LEFT JOIN follow
                ON follow."followerId"="user".id
        WHERE "user".id IN (select "followedId" from follow WHERE "followerId"=$1)
        GROUP BY post.id;`, [UserId])).rows;

        let likedBy = (await db.query(`
        SELECT * FROM "like"
        WHERE "userId" = $1
        `, [UserId])).rows;

        likedBy = likedBy.map(like => like.postId);


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

        let resposta = posts.map((post, index) => {
            return {
                userId: post.userId,
                postId: post.id,
                postUrl: post.url,
                postOwner: post.username,
                photoUrl: post.photoUrl,
                postDescription: post.description,
                numberOfLikes: post.numberOfLikes,
                numberOfReposts: post.numberOfReposts,
                numberOfComments: post.numberOfComments,
                hashtags: mappedHashtags[index],
                whoLiked: mappedWhoLiked[index],
                Comments: post.Comments,
                likedByViewer: (likedBy.includes(post.id) ? true : false),
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

export async function addRepost(req, res) {
    const { postId } = req.params; //id do usuario do qual queremos os posts
    const { userId } = res.locals.session; // id do usuario que está vendo os posts

    try {
        let postOwnerInquiring = (await db.query(` 
        SELECT * FROM "post" WHERE "id" = $1;
        `, [postId]))
        if (postOwnerInquiring.rowCount === 0) return res.status(404).send("The post you are trying to repost doesn't exist.")
        if (postOwnerInquiring.rows[0].userId === userId) return res.status(404).send("You can't repost your own post.")

        let rePostExiste = (await db.query(` 
        SELECT * FROM "rePost" WHERE "userId" = $1 AND "postId" = $2;
        `, [userId, postId]))

        if (rePostExiste.rowCount !== 0) { return res.status(401).send("This repost is alredy done!") }

        let insert = await db.query(`
        INSERT INTO "rePost" ("userId", "postId") VALUES ($1, $2);
        `, [userId, postId])

        return res.status(201).send("Repost added.")
    } catch (error) {
        return res.status(500).send(error.message)
    }
};

export async function addComment(req, res) {
    const { postId } = req.params; //id do usuario do qual queremos os posts
    const { userId } = res.locals.session; // id do usuario que está vendo os posts
    const { comment } = req.body

    if (comment === undefined || comment.length === 0) {
        return res.status(404).send("You can't make an empty comment")
    }

    try {
        let postInquiring = (await db.query(` 
        SELECT * FROM "post" WHERE "id" = $1;
        `, [postId]))

        if (postInquiring.rowCount === 0) {
            return res.status(404).send("The post you are trying to comment doesn't exist.")
        }

        let insert = await db.query(`
        INSERT INTO "comments" ("userId", "postId", "comment") VALUES ($1, $2, $3);
        `, [userId, postId, comment])

        return res.status(201).send("Comment added.")
    } catch (error) {
        return res.status(500).send(error.message)
    }
};