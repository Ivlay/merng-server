import { gql } from 'apollo-server';

export default gql`
    type Post {
        id           : ID!
        body         : String!
        userName     : String!
        comments     : [Comment]!
        likes        : [Like]!
        likeCount    : Int!
        commentCount : Int!
        createdAt    : String!
        updatedAt    : Date!
    }

    type Comment {
        id        : ID!
        createdAt : String!
        userName  : String!
        body      : String!
    }

    type Like {
        id        : ID!
        createdAt : String!
        userName  : String!
    }

    input RegisterInput {
        userName        : String!
        password        : String!
        confirmPassword : String!
        email           : String!
    }
    
    type User {
        id        : ID!
        email     : String!
        token     : String!
        userName  : String!
        createdAt : String!
        updatedAt : Date!
    }

    type Query {
        getPosts: [Post]
        getPost(postId: ID!): Post
    }

    type Mutation {
        register(registerInput: RegisterInput): User!
        login(userName: String!, password: String!): User!
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
        createComment(postId: ID!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post!
    }

    type Subscription {
        newPost: Post!
    }

    scalar Date
`;