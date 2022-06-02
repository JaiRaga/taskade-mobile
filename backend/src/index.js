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
    getTaskList(id: ID!): TaskList
  }

  type Mutation {
    signUp(input: SignUpInput!): AuthUser!
    signIn(input: SignInInput!): AuthUser!
    createTaskList(title: String!): TaskList!
    updateTaskList(id: ID!, title: String!): TaskList!
    deleteTaskList(id: ID!): Boolean!
    addUserToTaskList(taskListId: ID!, userId: ID!): TaskList!
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
    myTaskLists: async (_, __, { db, user }) => {
      if (!user) {
        throw new Error('Authenticaion Error. Please Sign in.');
      }
      const taskLists = await db
        .collection('TaskList')
        .find({ userIds: user._id })
        .toArray();
      console.log(taskLists);

      return taskLists;
    },
    getTaskList: async (_, { id }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication Failed. Please Sign in.');
      }
      const result = await db
        .collection('TaskList')
        .findOne({ _id: ObjectId(id) });
      console.log(result);
      return result;
    },
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
    createTaskList: async (_, { title }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication Failed. Please Sign in.');
      }

      const newTaskList = {
        title,
        createdAt: new Date().toISOString(),
        userIds: [user._id],
      };

      const result = await db.collection('TaskList').insertOne(newTaskList);
      // console.log(result);
      if (result.acknowledged) {
        const taskList = await db
          .collection('TaskList')
          .findOne({ _id: result.insertedId });
        return taskList;
      }
    },
    updateTaskList: async (_, { id, title }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication Failed. Please Sign in.');
      }

      const result = await db
        .collection('TaskList')
        .updateOne({ _id: ObjectId(id) }, { $set: { title } });

      console.log(result);
      if (result.acknowledged) {
        const taskList = await db
          .collection('TaskList')
          .findOne({ _id: ObjectId(id) });
        console.log(taskList);
        return taskList;
      }
    },
    deleteTaskList: async (_, { id }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication Failed. Please Sign in.');
      }
      const result = await db
        .collection('TaskList')
        .deleteOne({ _id: ObjectId(id) });
      return result.acknowledged && result.deletedCount !== 0;
    },
    addUserToTaskList: async (_, { taskListId, userId }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication Failed. Please Sign in.');
      }

      const taskList = await db
        .collection('TaskList')
        .findOne({ _id: ObjectId(taskListId) });

      if (
        taskList.userIds.find((dbId) => dbId.toString() === userId.toString())
      ) {
        return taskList;
      }

      const result = await db.collection('TaskList').updateOne(
        { _id: ObjectId(taskListId) },
        {
          $push: {
            userIds: ObjectId(userId),
          },
        }
      );
      console.log(result);
      if (result.acknowledged) {
        const taskList = await db
          .collection('TaskList')
          .findOne({ _id: ObjectId(taskListId) });
        return taskList;
      }
    },
  },

  User: {
    id: ({ _id, id }) => _id || id,
  },
  TaskList: {
    id: ({ _id, id }) => _id || id,
    progress: () => 0,
    users: async ({ userIds }, _, { db }) =>
      Promise.all(
        userIds.map((userId) => db.collection('Users').findOne({ _id: userId }))
      ),
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
