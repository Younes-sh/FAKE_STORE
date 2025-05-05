import {models, model, Schema} from "mongoose";

const UserSchema = new Schema({
    firstname: String,
    lastname: String,
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, default: "user"},
    isActive: {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: Date,
});


const User = models.User || model("User", UserSchema);
export default User;