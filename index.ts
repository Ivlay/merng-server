import { ApolloServer, PubSub } from 'apollo-server';
import mongoose                 from 'mongoose';
import { config }               from 'dotenv';
import typeDefs                 from './graphql/typeDefs';
import resolvers                from './graphql/resolvers';

config();

const {
    DB_PASSWORD,
    DB_NAME
} = process.env;

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({ req, pubsub }),
});

const uri = `mongodb+srv://Ivlay:${DB_PASSWORD}@cluster0.ni2kw.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`

mongoose
    .connect(uri, {
        useNewUrlParser    : true,
        useUnifiedTopology : true
    })
    .then(() => {
        console.log('Connected MongoDB');
        return server.listen({ port: 8080 });
    })
    .then(res => {
        console.log(`Server running at ${res.url}`)
    })
    .catch(error => console.error(error));
