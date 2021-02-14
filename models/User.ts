import { model, Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
    _doc            : any;
    id              : string;
    email           : string;
    userName        : string;
    password        : string,
    confirmPassword : string;
    token?          : string
};

const userSchema = new Schema({
    userName  : { type: String, unique: true },
    password  : String,
    email     : { type: String, unique: true },
}, { timestamps: true });

export default model<IUserDocument>('User', userSchema);
