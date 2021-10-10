import {Document, Schema, model} from "mongoose";

interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    token: string;
}

const userSchema = new Schema<IUser>({
    firstName: {type: String, default: ""},
    lastName: {type: String, default: ""},
    email: {type: String, unique: true, require: true},
    password: {type: String, require: true},
    token: {type: String}
});

export const userModel = model<IUser>("User", userSchema);
