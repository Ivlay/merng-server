import { IResolvers }                          from 'graphql-tools';
import { AuthenticationError, UserInputError } from 'apollo-server';
import Post                                    from '../../../models/Post';//TODO: write an aliases
import checkAuth                               from '../../../utils/checkAuth'; 

export const resolvers: IResolvers = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (error) {
                console.error(error);
            };
        },
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId);

                if (post) {
                    return post
                } else {
                    throw new Error('Post not found')
                };

            } catch (error) {
                throw new Error('Post not found')
            }
        }
    },
    Mutation: {
        async createPost (_, { body }, context) {
            const user = checkAuth(context);

            if (!body.trim()) throw new Error ('Post body cannot be empty')

            const newPost = new Post({
                body,
                user     : user.id,
                userName : user.userName
            });

            const post = await newPost.save();

            context.pubsub.publish('NEW_POST', {
                newPost: post
            });

            return post
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);

            try {
                const post = await Post.findById(postId);

                if (user.userName === post.username || user.userName === 'Ivlay') {
                    await post.delete();

                    return 'Post deleted';
                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            } catch (error) {
                throw new Error(error)
            }
        },
        likePost: async(_, { postId }, context) => {
            const { userName } = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
                if (post.likes.find((like: { userName: string; }) => like.userName === userName)) {

                    post.likes = post.likes.filter((like: { userName: string; }) => like.userName !== userName);
                    await post.save();
                } else {
                    post.likes.push({
                        userName,
                        createdAt: new Date().toISOString()
                    })
                };

                await post.save();

                return post;
            } else throw new UserInputError('Post not found');
        }
    },
    Subscription: {
        newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
        }
    }
};
