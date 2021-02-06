import { AuthenticationError } from 'apollo-server';
import jwt                     from 'jsonwebtoken';
import { config }              from 'dotenv';
import { Request }             from 'express';

import { IUserDocument }       from '../models/User';

config();

const { SECRET_KEY } = process.env

export default (context: {req: Request}) => {
    const authHeader = context.req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split('Bearer ')[1];

        if (token) {
            try {
                const user = jwt.verify(token, SECRET_KEY as string) as IUserDocument;

                return user;
            } catch (error) {
                throw new AuthenticationError('Invalid or Expired token');
            };
        };

        throw new Error('Authentication token must be \'Bearer [token]');
    };

    throw new Error('Authorization header must be provided');
};
