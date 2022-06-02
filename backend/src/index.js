const { ApolloServer, gql } = require('apollo-server');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Load env vars
const dotenv = require('dotenv');
dotenv.config();

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { getUserFromToken } = require('./utils');

const { DB_URI, DB_NAME } = process.env;

// Start the db
const start = async () => {
  const client = new MongoClient(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  await client.connect();
  const db = client.db(DB_NAME);
  console.log('connected to mongodb atlas 🚀');

  const context = {
    db,
  };

  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const user = await getUserFromToken(req.headers.authorization, db);

      return {
        db,
        user,
      };
    },
    csrfPrevention: true,
  });

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url} 🚀`);
  });
};

start();
