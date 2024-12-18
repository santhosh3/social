const user = require("./userModel.json");
const post = require("./postModel.json");
const { v4: uuidv4 } = require("uuid");
const like = require("./likeModel.json");
const bcrypt = require("bcryptjs");
const comment = require("./commentModel.json");
const { createToken, insertDB } = require("../utils");
const follow = require("./followModel.json");

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
  obj['id'] = uuidv4();
  obj['password'] = hashedPassword
  const users = [...user, obj];
  await insertDB(users, 'userModel');
  return obj;
};

const getTitle = (title) => {
  return post.find((x) => x.title === title) ? true : false
};

const InsertPost = async (obj) => {
  const postId = uuidv4();
  obj['id'] = postId;
  obj['createdAt'] = new Date();
  const posts = [...post, obj];
  await insertDB(posts, 'postModel')

  return obj
}

const getAllPostsOfUser = (id) => {
  const posts = post.filter(x => x.userId == id).map(({ title, description }) => { return { title, description } })
  return posts
}

const getAllposts = () => {
  const allPosts = post.map(({ id, title, likes, userId, createdAt }) => 
    { return { 
      id,
      title,
      likes,
      createdAt,
      author: user.find(x => x.id == userId).username 
    }})
  return allPosts.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
}

const incrementLikesForAPost = async (postId, userId) => {
  console.log({postId,userId});
  let obj = post.find((x) => x.id === postId);
  let checkLikesByUser = like.find(x => x.userId === userId);

  if (checkLikesByUser) {
    if (checkLikesByUser.like) {
      checkLikesByUser.like = false;
      obj.likes--;

      //update post
      const posts = [...post];
      await insertDB(posts, 'postModel')

      //update likes
      const likes = [...like];
      await insertDB(likes, 'likeModel')

      //return posts
      return posts;
    } else {
      checkLikesByUser.like = true;
      obj.likes++;

      //update posts
      const posts = [...post];
      await insertDB(posts, 'postModel')

      //update likes
      const likes = [...like];
      await insertDB(likes, 'likeModel')

      //return posts
      return posts;
    }
  }

  obj.likes++;
  const likes = [...like, { postId, userId, like: true }];
  await insertDB(likes, 'likeModel')


  const posts = [...post];
  await insertDB(posts, 'postModel')


  return post;
}

const getPost = (postId) => {
  const { id, title, likes, description, userId, createdAt } = post.find(x => x.id === postId);
  const comments = comment[postId];
  let commentForPost
  if (!Array.isArray(comments)) {
    commentForPost = []
  } else {
    commentForPost = comment[postId].map((x) => {
      return {
        comment: x.comment,
        createdAt,
        user: user.find((y) => y.id == x.userId).username,
      };
    }).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))  
  }
  return {
    id,
    title,
    likes,
    description,
    author: user.find((x) => x.id == userId).username,
    createdAt,
    comment: commentForPost,
  };
}

const deletePost = async (postId, userId) => {
  const findPost = post.find((x) => x.id === postId && x.userId === userId)
  if (findPost) {
    const removePost = post.filter((x) => x.id !== postId && x.userId !== userId);
    await insertDB(removePost, 'postModel');
    return true
  } else {
    return false
  }
}

const updatePost = async (postId, userId, obj) => {
  const findPost = post.find((x) => x.id === postId && x.userId === userId)
  if (findPost) {
    const updatedPost = {
      ...findPost,
      ...obj,
    }

    const removePost = post.filter((x) => x.id !== postId);
    let allPosts = [...removePost, updatedPost];
    await insertDB(allPosts, 'postModel');
    return { status: true, msg: updatedPost }
  } else {
    return { status: false, msg: "you dont have access to update this post" }
  }
}


const createComment = async (commentByUser, postId, userId) => {
  let obj = {
    commentId: uuidv4(),
    comment: commentByUser,
    createdAt: new Date(),
    userId
  }
  let findPostId = comment[postId];
  if (findPostId) {
    comment[postId] = [...findPostId, obj];
  } else {
    comment[postId] = [obj]
  }
  await insertDB(comment, "commentModel");
  return obj;
}

const users = (id) => {
  const userFollow = follow.filter(x => (x.follow == id || x.followBy == id) && x.accept).map(x => [x.follow, x.followBy])
  const followeduser = [...new Set(userFollow.flat(Infinity))];
  return user.filter(x => x.id != id && !followeduser.includes(x.id));
}

const followers = (id) => {
  console.log(id)
  return [follow.filter(x => x.follow == id && x.accept).length, follow.filter(x => x.followBy == id && x.accept).length];
}

const createFollow = async (followedBy, follower) => {
  await insertDB([...follow, { follow: follower, followedBy: followedBy, accept: false, createdAt: new Date() }], "followModel")
}

const acceptRequest = async (followedBy, follower) => {
  let obj = follow.find(x => x.follow === follower && x.followedBy === followedBy);
  obj.accept = true;
  await insertDB([...follow], "followModel")
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
  incrementLikesForAPost,
  getPost,
  deletePost,
  updatePost,
  createComment,
  users,
  followers,
  createFollow,
  acceptRequest
};




/*
sumanth :- eyJhbGciOiJIUzI1NiJ9.MzYyODUyZTYtNWRiOC00ZTQ0LWE2NWItN2E2MzBhOGUwMmQ3.qHVNK0HJie0EFt6U6ukokzkkC2SSvS6W0wwgLHrFSUM
santhosh :- eyJhbGciOiJIUzI1NiJ9.NGViYWM1NGYtMzVlMS00NjVmLWJlMjctYWFiMzFmYjgwZTA2.enbVLIaP7ut1AMkuxhCJ-3FWewM_zmPM4_I_S3N2RRk
*/
