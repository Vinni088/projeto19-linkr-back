import joi from "joi"

export const signUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    phone: joi.string().min(8).max(11).required(),
    city: joi.string().required(),
    state: joi.string().min(2).max(2).required()
});
/*{
    "name": "Vinni",
    "email": "vinni@gmail.com",
    "password": "123asd",
    "phone": "61999167530",
    "city": "Brasília",
    "state": "DF"
}*/

export const signInSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
});
/*{
    email: "joao@driven.com.br",
    password: "driven",
}*/