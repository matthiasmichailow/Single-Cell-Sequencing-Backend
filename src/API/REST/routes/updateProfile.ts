import express from "express";
import verify_authenticated_user from "../middleware/verify_authenticated_user";
import {ExtRequest} from "../../../definitions/ext_request";
import {userModel} from "../../../database/models/user";
import bcrypt from "bcrypt";

export default function update_profile_route() {
    let router = express.Router();

    router
        .post("/update_profile")
        .use(verify_authenticated_user())
        .use(async (req: ExtRequest, res) => {
            const {firstName, lastName, email, password, old_email} = req.body;
            if (!await userModel.findOne({old_email})) {
                return res.status(409).send("User with the given email does not exists");
            }
            if (await userModel.findOne({email})) {
                return res.status(409).send("There is already another user with the given email!")
            }
            const encryptedPassword = await bcrypt.hash(password, 15);
            await userModel.updateOne({old_email}, {
                email, firstName, lastName, password: encryptedPassword
            });
            console.log(`${req.user_id} has updated their profile`);
            res.send("Your profile has been updated")
        })

    return router;
}