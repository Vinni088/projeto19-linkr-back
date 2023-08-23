import { db } from "../database/database.connection.js"
import bcrypt from "bcrypt"
import { deleteFollow, insertFollow } from "../repositories/user.repository.js";

//////signup

///variavel para pegar o valor do tempo agora e salvar no banco na coluna de createdat.
///necessario usar dayjs
// const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

export async function signUp(req, res) {
    const { email, password, username, photoUrl } = req.body
    const lowerCaseEmail = email.toLowerCase(); ///transforma o email sempre para lowercase

    try {
        //verificação se já existe usuário com esse email no banco cadastrado.
        const userVerify = await db.query(`SELECT * FROM "user" WHERE email=$1;`, [email])
        if (userVerify.rows.length > 0) {
            return res.status(409).send('There is an user already with this email.');
        }
        // Encriptação da senha com bcrypt
        const passCrypt = bcrypt.hashSync(password, 10)

        //se não existir usuario com esse email, cadastra o usuario no banco.
        await db.query('INSERT INTO "user" (email, password, username, "photoUrl") values ($1, $2, $3, $4);', [lowerCaseEmail, passCrypt, username, photoUrl]);
        return res.status(201).send('User created!');
    } catch (err) {
        res.status(500).send(err.message)
    }
}

// Como usuário logado, quero ir para a página de um usuário ao clicar no nome dele

// vai ser um onclick no front end 


// A página de um usuário deve ter como URL /user/:id em que :id é o id do usuário

///daniel - 14/08/2023:21:01
export async function getUsers(req, res) {
    const { userId } = res.locals.session;

    try {

        const user = await db.query('SELECT * FROM "user" WHERE id = $1;', [userId]);
        if (user.rowCount === 0) return res.status(404).send('USER NOT FOUND');

        res.send(user.rows[0]);

    } catch (err) {

        return res.status(500).send(err.message)

    }
}

// Navegar pra página do usuário ao clicar no nome dele em um post
//frontend

// Navegar pra página do usuário ao clicar no nome dele em um resultado de busca
///front + backend

export async function searchUsers(req, res) {
    const { str } = req.body

    try {
        const sanitizedStr = `%${str}%`
        const users = await db.query('SELECT username, "photoUrl", id FROM "user" WHERE username ILIKE $1;', [sanitizedStr])

        return res.status(200).send(users.rows)
    } catch (err) {
        return res.status(500).send(err.message)
    }
}



export async function getUserById(req, res) {
    const { id } = req.params

    try {
        const user = await db.query('SELECT * FROM USERS WHERE id = $1;', [id])
        id, name, email, password, photoUrl

        const userData = {
            name: user.rows[0].name,
            email: user.rows[0].email,
            password: user.rows[0].password,
            photoUrl: user.rows[0].photoUrl
        }

        return res.status(200).send(userData)
    } catch (error) {
        return res.status(500).send(err.message)

    }

}

export async function followUser(req, res) {
    const { id } = req.params; // followedId
    const { userId } = res.locals.session; // followerId

    try {

        await insertFollow(userId, id);
        res.sendStatus(201);
    } catch (err) {
        if (Number(err.code) === 23505) return res.status(409).send({ message: "User already follows the other user!" });

        res.status(500).send(err.message);
    }
}

export async function unFollowUser(req, res) {
    const { id } = req.params; // followedId
    const { userId } = res.locals.session; // followerId

    try {

        const result = await deleteFollow(userId, id);
        if (result.rowCount === 0) return res.status(404).send({ message: "You can't unfollow the user because you never followed him in the first place!" });
        res.sendStatus(204);
    } catch (err) {

        res.status(500).send(err.message);
    }
}

/*
app.get('/user/:id', async (req, res) => {


})
*/
