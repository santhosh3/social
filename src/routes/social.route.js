const express = require("express");
const {auth} = require("../middleware/auth");
const {getUserByToken, createPostForUser, getAllPosts, likePost, getPostById, deletePostById, UpdatePostById} = require("../controller/socialController");
const socialRouter = express.Router();

socialRouter.use(auth);

socialRouter.get("/user", getUserByToken);
socialRouter.post("/post", createPostForUser);
socialRouter.get("/post", getAllPosts)
socialRouter.post("/post/like", likePost);
socialRouter.get("/post/:id", getPostById);
socialRouter.delete("/post/:id", deletePostById);
socialRouter.put("/post/:id", UpdatePostById);



module.exports = socialRouter

/*

---------
title
               Id : postId
heartSys
---------

*/
