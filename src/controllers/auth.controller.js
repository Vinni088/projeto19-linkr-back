import { deleteSession } from "../repositories/session.repository";

export async function signout(req, res) {
    const { id } = res.locals.session;

    try {

        await deleteSession(id);

        res.sendStatus(200);
    } catch (err) {

        res.status(500).send(err.message);
    }
}