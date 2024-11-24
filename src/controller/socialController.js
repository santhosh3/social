const { InsertPost, getTitle, getAllPostsOfUser, getAllposts, incrementLikesForAPost } = require("../models");

const getUserByToken = async (req, res) => {
    try {
        const getAllPostsOfAuthor = getAllPostsOfUser(req.user.id)
        return res.status(200).json({ status: true, message: { ...req.user, posts: getAllPostsOfAuthor } });
    } catch (error) {
        return res.status(500).json({ status: true, message: error.message });
    }
}

const createPostForUser = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req?.user?.id;
        if (getTitle(title)) {
            return res.status(400).json({ status: false, message: "Title is already present please select another title" })
        }
        const createPost = await InsertPost({ title, description, likes: 0, userId });
        return res.status(201).json({ status: true, message: createPost })
    } catch (error) {
        return res.status(500).json({ status: true, message: error.message });
    }
}

const getAllPosts = async (req, res) => {
    try {
        return res.status(200).json({ status: true, message: getAllposts() })
    } catch (error) {
        return res.status(500).json({ status: true, message: error.message });
    }
}

const likePost = async(req, res) => {
    try {
        let postId = req?.body?.postId;
        let userId = req?.user?.id;
        const posts = await incrementLikesForAPost(postId,userId)
        return res.status(200).send({status: true, message : posts});
    } catch (error) {
        return res.status(500).json({ status: true, message: error.message });   
    }
}

module.exports = {
    getUserByToken, createPostForUser, getAllPosts, likePost
}