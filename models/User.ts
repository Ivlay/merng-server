import { model, Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
    _doc            : any;
    id              : string;
    email           : string;
    userName        : string;
    password        : string,
    confirmPassword : string;
    token?          : string
    createdAt       : string;
};

const userSchema = new Schema({
    userName  : String,
    password  : String,
    email     : String,
    createdAt : String
});

export default model<IUserDocument>('User', userSchema);
