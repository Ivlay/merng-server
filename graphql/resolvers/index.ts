import { resolvers as postsResolvers }    from './posts';
import { resolvers as usersResolvers }    from './users';
import { resolvers as commentsResolvers } from './comments';

export default {
    Post: {
        likeCount: (parent: { likes: string | any[]; }) => {
            return parent.likes.length
        },
        commentCount: (parent: { comments: string | any[]; }) => parent.comments.length
    },
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation
    },
    Subscription: {
        ...postsResolvers.Subscription
    }
};
