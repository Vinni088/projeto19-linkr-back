const app = express();
app.use(cors());
app.use(express.json());

// Como usuário logado, quero ir para a página de um usuário ao clicar no nome dele

// vai ser um onclick no front end 


// A página de um usuário deve ter como URL /user/:id em que :id é o id do usuário

///daniel - 14/08/2023:21:01
app.get("/user/:id", async (req, res) => {
    const { id } = req.params

    ///precisa de token no header
    ///tem como fazer com joi e com header.

    if (!token) {
        return res.status(409).send('UNAUTHORIZED! TOKEN IS REQUIRED!')
    }

    try {
        const user = await db.query('SELECT * FROM USERS WHERE ID = $1;', [id])
        if (user.rows.length > 0) {
            const userData = {
                name: user.rows[0].name,
                ///adicionar outras mais coisas aqui que quiser retornar
            }
            return res.status(200).send(userData)
        } else {
            return res.status(404).send('USER NOT FOUND')
        }

    } catch (err) {

        return res.status(500).send(err.message)

    }
})

// Navegar pra página do usuário ao clicar no nome dele em um post
//frontend

// Navegar pra página do usuário ao clicar no nome dele em um resultado de busca
///front + backend









//////signup


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
    const lowerCaseemail = email.toLowerCase(); ///transforma o email sempre para lowercase

    try {

        ///validação de dados de criação com joi
        const validation = createUser.validate({ name, email, password }, { abortEarly: false });
        if (validation.error) {
            const errors = validation.error.details.map((detail) => detail.message);
            return res.status(422).json(errors);
        }


        ///validação se a senha e a confirmação de senha são iguais
        if (password !== confirmPassword) {
            return res.status(422).send('Password and Confirm Password must match.');
        }

        if (!photoUrl.includes('http')) {
            photoUrl = 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg'
        }

        // Encriptação da senha com bcrypt
        const passCrypt = bcrypt.hashSync(password, 10);

        ///verificação se já existe usuário com esse email no banco cadastrado.
        const userVerify = await db.query('SELECT * FROM USERS where email = $1', [email]);
        if (userVerify.rows.length > 0) {
            return res.status(409).send('There is an user already with this email.');
        } else {
            ///se não existir usuario com esse email, cadastra o usuario no banco.
            const user = await db.query('INSERT INTO USERS (name, email, password, photoUrl "createdat") values ($1, $2, $3, $4);', [name, lowerCaseemail, passCrypt, photoUrl, createdAt]);
            return res.status(201).send('User created!');
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }


})