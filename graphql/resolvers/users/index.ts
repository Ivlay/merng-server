import { IResolvers }          from 'graphql-tools';
import bcrypt                  from 'bcryptjs';
import jwt                     from 'jsonwebtoken';
import User, { IUserDocument } from '@models/User';
import { config }              from 'dotenv';
import { UserInputError }      from 'apollo-server';
import {
    validateRegisterInput,
    validateLoginInput
} from '@utils/validator';

config();

const { SECRET_KEY } = process.env;

interface IUserRegister<T> {
    registerInput: T
};

const generateToken = (user: IUserDocument) => {
    return jwt.sign({
        id       : user.id,
        email    : user.email,
        userName : user.userName
    }, SECRET_KEY as string, {expiresIn: '12h'})
};

export const resolvers: IResolvers = {
    Mutation: {
        async login(_, { userName, password }) {
            const { errors, valid } = validateLoginInput({userName, password});

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            };

            const user: IUserDocument = await User.findOne({ userName });

            if (!user) {
                errors.userName = 'User not found';

                throw new UserInputError('User not found', { errors });
            };

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                errors.password = 'Wrong credentials';

                throw new UserInputError('Wrong credentials', { errors });
            };

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            };
        },
        async register(
            _,
            { registerInput:
                { userName, email, password, confirmPassword }
            }: IUserRegister<IUserDocument>
        ) {
            const { errors, valid } = validateRegisterInput({userName, email, password, confirmPassword});

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            };

            const user: IUserDocument[] = await User.find({ $or: [ { userName }, { email } ] });

            if (user.length) {
                throw new UserInputError('User alredy exist', {
                    errors: {
                        userName: 'User alredy exist'
                    }
                });
            };

            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                userName,
                password
            });
            
            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            };
        }
    }
};
