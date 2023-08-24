export function validateSchema(schema) {
    return (req, res, next) => {
        console.log('schema')
        //console.log(schema)
        const validation = schema.validate(req.body, { abortEarly: false });

        console.log(validation)

        if (validation.error) {
            const errors = validation.error.details.map(detail => detail.message);
            return res.status(422).send(errors)
        }

        next();
    }
}