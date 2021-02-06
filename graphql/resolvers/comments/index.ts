import { IResolvers }                          from 'graphql-tools';
import { AuthenticationError, UserInputError } from 'apollo-server';

import Post                                    from '../../../models/Post';

import checkAuth                               from '../../../utils/checkAuth';

export const resolvers: IResolvers = {
    Mutation: {
        createComment: async (_, { postId, body }, context) => {
            const { userName } = checkAuth(context);

            if (!body.trim()) {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment body must not empty'
                    }
                })
            };

            const post = await Post.findById(postId)

            if (post) {
                post.comments.unshift({
                    body,
                    userName,
                    createdAt: new Date().toISOString()
                });

                await post.save();

                return post
            } else {
                throw new UserInputError('Post not found')
            }
        },
        deleteComment: async(_, { postId, commentId }, context) => {
            const { userName } = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
                const commentIndex = post.comments.findIndex((c: { id: any; }) => c.id === commentId);

                if (commentIndex + 1 && post.comments[commentIndex].userName === userName || userName === 'Ivlay') {
                    post.comments.splice(commentIndex, 1);
                    await post.save();

                    return post;
                } else {
                    throw new AuthenticationError('Action allowed');
                };
            } else {
                throw new UserInputError('Post not found');
            };
        }
    }
};
