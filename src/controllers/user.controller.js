import { db } from "../database/database.connection.js"
import bcrypt from "bcrypt"

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
