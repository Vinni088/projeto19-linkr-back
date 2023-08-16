import express from "express"
import cors from "cors"
import router from "./routes/index.routes.js"
import dayjs from "dayjs"
import Joi from "joi"
import bcrypt from "bcrypt"


const app = express()

app.use(cors())
app.use(express.json())
app.use(router)




/////signup


///variavel para pegar o valor do tempo agora e salvar no banco na coluna de createdat.
///necessario usar dayjs
const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');


//joi com validação de nome, email e senha.
const createUser = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

app.post("/signup", async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    let { photoUrl } = req.body

    try {
        ///validação de dados de criação com joi
        const validation = createUser.validate({ name, email, password }, { abortEarly: false });
        if (validation.error) {
            const errors = validation.error.details.map((detail) => detail.message);
            return res.status(422).json(errors);
        }


        //transforma o email sempre para lowercase
        const lowerCaseemail = email.toLowerCase();

        ///validação se a senha e a confirmação de senha são iguais
        if (password !== confirmPassword) {
            return res.status(422).send('Password and Confirm Password must match.');
        }

        if (!photoUrl || !photoUrl.includes('http') ) {
            photoUrl = 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg'
        }
        const passCrypt = bcrypt.hashSync(password, 10);
        return res.status(201).send('User created!');

    } catch (err) {
        return res.status(500).send(err.message);

    }

})





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running server on port ${PORT}`));