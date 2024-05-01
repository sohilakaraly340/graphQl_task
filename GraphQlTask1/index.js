  const { ApolloServer, gql } = require("apollo-server");
const  axios  = require("axios");
const fetch = require("node-fetch");
 
const typeDefs = gql`
  type Comment {
    id: Int
    postId: Int
    name: String
    email: String
    body: String
  }

  type Post {
    id: Int
    title: String
    body: String
    comments: [Comment]
  }

  type Query {
    posts: [Post]
    comment(commentId: Int!): Comment
  }

  type Mutation {
    createComment(data: CreateCommentInput!): Comment
  }

  input CreateCommentInput {
    postId: Int!
    name: String!
    email: String!
    body: String!
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Post: {
      comments: async (parent) => {
        const { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts/${parent.id}/comments`);
        return data;
      },
    },
    Query: {
      posts: async () => {

        const {data} = await axios.get("https://jsonplaceholder.typicode.com//posts");
        return data;
      },
      comment: async (_, { commentId }) => {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com//comments/${commentId}`
        );
        return response.json();
      },
    },
    Mutation: {
      createComment: async (_, { data }) => {
        const { postId, name, email, body } = data;
        const response = await axios.post(
          `https://jsonplaceholder.typicode.com/posts/${postId}/comments`,
          { postId, name, email, body }
        );
        return response.data; // Extract data from the response
      },
    },
    
  },
});

server.listen(3001).then(() => {
  console.log("Server listening on port 3001");
});
