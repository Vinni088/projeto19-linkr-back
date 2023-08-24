import joi from "joi"

//joi com validação de nome, email e senha.
export const signUpSchema = joi.object({
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required().valid(joi.ref("password")),
    photoUrl: joi.string().uri().required()
});


export const signInSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
});
