const { ApolloServer, gql } = require('apollo-server');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Load env vars
const dotenv = require('dotenv');
dotenv.config();

const { DB_URI, DB_NAME, JWT_SECRET } = process.env;

const getToken = (user) =>
  jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '60 days' });

const getUserFromToken = async (token, db) => {
  if (!token) {
    return null;
  }

  const tokenData = jwt.verify(token, JWT_SECRET);

  if (!tokenData?.id) {
    return null;
  }

  const user = await db
    .collection('Users')
    .findOne({ _id: ObjectId(tokenData.id) });

  return user;
};

const typeDefs = gql`
  type Query {
    myTaskLists: [TaskList!]!
  }

  type Mutation {
    signUp(input: SignUpInput): AuthUser!
    signIn(input: SignInInput): AuthUser!
  }

  input SignUpInput {
    email: String!
    password: String!
    name: String!
    avatar: String
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type AuthUser {
    user: User!
    token: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
  }

  type TaskList {
    id: ID!
    createdAt: String!
    title: String!
    progress: Float!

    users: [User!]!
    todos: [Todo!]!
  }

  type Todo {
    id: ID!
    content: String!
    isCompleted: Boolean!

    taskList: TaskList!
  }
`;

const resolvers = {
  Query: {
    myTaskLists: () => [],
  },
  Mutation: {
    signUp: async (_, { input }, { db }) => {
      const hashedPassword = bcrypt.hashSync(input.password);
      const user = {
        ...input,
        password: hashedPassword,
      };
      // save to db
      const result = await db.collection('Users').insertOne(user);
      console.log(result);
      if (result.acknowledged) {
        return {
          user,
          token: getToken(user),
        };
      }
    },
    signIn: async (_, { input }, { db }) => {
      const user = await db.collection('Users').findOne({ email: input.email });
      // Check if password is correct
      const isPasswordCorrect =
        user && bcrypt.compareSync(input.password, user.password);

      if (!user || !isPasswordCorrect) {
        throw new Error('Invalid Credentials!');
      }

      return {
        user,
        token: getToken(user),
      };
    },
  },

  User: {
    id: ({ _id, id }) => _id || id,
  },
};

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
