import { Document } from 'mongoose';

// export interface IMongoSchema<T> extends Document<T> {
//     type<T>
// };
//TODO: mb generic????
export type TMongoSchema<T extends {}> = T;
