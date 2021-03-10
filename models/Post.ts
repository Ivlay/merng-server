import { model, Schema, Document } from 'mongoose';

export interface IPostDocument extends Document {
    _doc      : any;
    id?       : string;
    body      : string;
    userName  : string;
    createdAt : string;
    updatedAt : number;
    comments  : Pick<IPostDocument, 'body' | 'userName' | 'createdAt' | 'id'>[];
    likes     : Pick<IPostDocument, 'userName' | 'createdAt' | 'id'>[];
};

const postSchema = new Schema({
    body      : String,
    userName  : String,
    createdAt : String,
    comments  : [
        {
            body      : String,
            userName  : String,
            createdAt : String
        },
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

export default model<IPostDocument>('Post', postSchema);
