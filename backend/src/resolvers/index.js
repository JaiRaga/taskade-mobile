const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const { getToken } = require('../utils');

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
    // Auth users
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
    // TaskList
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
    //TODO items
    createToDo: async (_, { content, taskListId }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication Failed. Please Sign in.');
      }
      const newToDo = {
        content,
        taskListId: ObjectId(taskListId),
        isCompleted: false,
      };
      const result = await db.collection('ToDo').insertOne(newToDo);
      console.log(result);
      if (result.acknowledged) {
        const todo = await db
          .collection('ToDo')
          .findOne({ _id: result.insertedId });
        console.log(todo);
        return todo;
      }
    },
    updateToDo: async (_, data, { db, user }) => {
      if (!user) {
        throw new Error('Authentication Failed. Please Sign in.');
      }
      const result = await db
        .collection('ToDo')
        .updateOne({ _id: ObjectId(data.id) }, { $set: data });

      if (result.acknowledged) {
        const todo = await db
          .collection('ToDo')
          .findOne({ _id: ObjectId(data.id) });
        return todo;
      }
    },
    deleteToDo: async (_, { id }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication Failed. Please Sign in.');
      }
      const result = await db
        .collection('ToDo')
        .deleteOne({ _id: ObjectId(id) });
      console.log(result);
      return result.acknowledged && result.deletedCount !== 0;
    },
  },

  User: {
    id: ({ _id, id }) => _id || id,
  },
  TaskList: {
    id: ({ _id, id }) => _id || id,
    progress: async ({ _id }, _, { db }) => {
      const todos = await db
        .collection('ToDo')
        .find({ taskListId: ObjectId(_id) })
        .toArray();

      const completed = todos.filter((todo) => todo.isCompleted);

      if (todos.length === 0) {
        return 0;
      }

      return (100 * completed.length) / todos.length;
    },
    users: async ({ userIds }, _, { db }) =>
      Promise.all(
        userIds.map((userId) => db.collection('Users').findOne({ _id: userId }))
      ),
    todos: async ({ _id }, _, { db }) =>
      await db
        .collection('ToDo')
        .find({ taskListId: ObjectId(_id) })
        .toArray(),
  },
  ToDo: {
    id: ({ _id, id }) => _id || id,
    taskList: async ({ taskListId }, _, { db }) =>
      await db.collection('TaskList').findOne({ _id: ObjectId(taskListId) }),
  },
};

module.exports = resolvers;
