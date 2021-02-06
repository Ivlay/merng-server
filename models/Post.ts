import { model, Schema } from 'mongoose';
//TODO: write an interface
const postSchema = new Schema({
    body      : String,
    userName  : String,
    createdAt : String,
    comments  : [
        {
            body      : String,
            userName  : String,
            createdAt : String
        }
    ],
    likes: [
        {
            userName  : String,
            createdAt : String
        }
    ],
    user: {
        type : Schema.Types.ObjectId,
        ref  : 'users'
    }
}, { timestamps: true });

export default model('Post', postSchema);
