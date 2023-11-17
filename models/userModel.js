import { Schema, model } from "mongoose";


const userSchema = new Schema({
    username: {
        type: String,
        isUnique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        required: true
    }
})

const userModel = model('user', userSchema);

export default userModel;
