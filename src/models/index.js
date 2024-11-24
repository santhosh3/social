const user = require("./userModel.json");
const post = require("./postModel.json");
const { v4: uuidv4 } = require("uuid");
const like = require("./likeModel.json");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs").promises;
const { createToken, insertDB } = require("../utils");

const findEmail = (email) => {
  return user.find((x) => x.email === email) ? true : false;
};

const getUserByEmail = (email) => {
  return user.find((x) => x.email === email)
};

const getUserById = (id) => {
  return user.find((x) => x.id === id)
};

const InsertUser = async (obj) => {
  const hashedPassword = await bcrypt.hash(obj.password, 10);
  const createId = uuidv4()
  obj = {
    ...obj,
    id: createId,
    password: hashedPassword,
  };
  const users = [...user, obj];
  await insertDB(users, 'userModel');
  return obj;
};

const getTitle = (title) => {
  return post.find((x) => x.title === title) ? true : false
};

const InsertPost = async (obj) => {
  const postId = uuidv4();
  obj = {
    id: postId,
    ...obj
  }
  const posts = [...post, obj];
  await fs.writeFile(
    path.join(__dirname, "postModel.json"),
    JSON.stringify(posts)
  );
  return obj
}

const getAllPostsOfUser = (id) => {
  const posts = post.filter(x => x.userId == id).map(({ title, description }) => { return { title, description } })
  return posts
}

const getAllposts = () => {
  return post.map(({ id, title, likes }) => { return { id, title, likes } })
}

const incrementLikesForAPost = async (postId, userId) => {
  let obj = post.find((x) => x.id === postId);
  let checkLikesByUser = like.find(x => x.userId === userId);

  if (checkLikesByUser) {
    if (checkLikesByUser.like) {
      checkLikesByUser.like = false;
      obj.likes--;

      //update post
      const posts = [...post];
      await fs.writeFile(
        path.join(__dirname, "postModel.json"),
        JSON.stringify(posts)
      );

      //update likes
      const likes = [...like];
      await fs.writeFile(
        path.join(__dirname, "likeModel.json"),
        JSON.stringify(likes)
      );

      return posts;
    } else {
      checkLikesByUser.like = true;
      obj.likes++;
      const posts = [...post];

      //update post
      await fs.writeFile(
        path.join(__dirname, "postModel.json"),
        JSON.stringify(posts)
      );

      //update likes
      const likes = [...like];
      await fs.writeFile(
        path.join(__dirname, "likeModel.json"),
        JSON.stringify(likes)
      );
      return posts;
    }
  }

  obj.likes++;
  const likes = [...like, {postId, userId, like:true}];
  await fs.writeFile(
    path.join(__dirname, "likeModel.json"),
    JSON.stringify(likes)
  );

  const posts = [...post];
  await fs.writeFile(
    path.join(__dirname, "postModel.json"),
    JSON.stringify(posts)
  );

  return post;
}

module.exports = {
  findEmail,
  InsertUser,
  getUserByEmail,
  getUserById,
  InsertPost,
  getTitle,
  getAllPostsOfUser,
  getAllposts,
  incrementLikesForAPost
};




/*
sumanth :- eyJhbGciOiJIUzI1NiJ9.MzYyODUyZTYtNWRiOC00ZTQ0LWE2NWItN2E2MzBhOGUwMmQ3.qHVNK0HJie0EFt6U6ukokzkkC2SSvS6W0wwgLHrFSUM
santhosh :- eyJhbGciOiJIUzI1NiJ9.NGViYWM1NGYtMzVlMS00NjVmLWJlMjctYWFiMzFmYjgwZTA2.enbVLIaP7ut1AMkuxhCJ-3FWewM_zmPM4_I_S3N2RRk
*/