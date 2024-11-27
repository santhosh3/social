const express = require("express");
const { auth } = require("../middleware/auth");
const { showUsers } = require("../controller/userController");
const { getUserByToken, createPostForUser, getAllPosts, likePost, getPostById, deletePostById, UpdatePostById } = require("../controller/socialController");
const { createCommentForPost, sendFollowRequest, acceptFollowRequest } = require("../controller/commentController");
const socialRouter = express.Router();

socialRouter.use(auth);

socialRouter.get("/users", showUsers)
socialRouter.get("/user", getUserByToken);
socialRouter.post("/post", createPostForUser);
socialRouter.get("/post", getAllPosts)
socialRouter.post("/post/like", likePost);
socialRouter.get("/post/:id", getPostById);
socialRouter.delete("/post/:id", deletePostById);
socialRouter.put("/post/:id", UpdatePostById);
socialRouter.post("/comment/:id", createCommentForPost);

socialRouter.post("/follow/:userId", sendFollowRequest)
socialRouter.post("/followBack/:userId", acceptFollowRequest);




module.exports = socialRouter

