const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const { JWT_SECRET } = process.env;

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

module.exports = { getToken, getUserFromToken };
