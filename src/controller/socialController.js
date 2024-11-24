const { InsertPost, getTitle, getAllPostsOfUser, getAllposts, incrementLikesForAPost, getPost, deletePost, updatePost } = require("../models");

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


const likePost = async (req, res) => {
    try {
        let postId = req?.id?.postId;
        let userId = req?.user?.id;
        const posts = await incrementLikesForAPost(postId, userId)
        return res.status(200).send({ status: true, message: posts });
    } catch (error) {
        return res.status(500).json({ status: true, message: error.message });
    }
}

const getPostById = async (req, res) => {
    try {
        const postId = req?.params?.id;
        const Post = getPost(postId);
        return res.status(200).json({ status: true, message: Post })
    } catch (error) {
        return res.status(500).json({ status: true, message: error.message });
    }
}

const deletePostById = async (req, res) => {
    try {
        const userId = req?.user?.id;
        const postId = req?.params?.id;
        const Post = await deletePost(postId, userId);
        if (Post) {
            return res.status(200).json({ status: true, message: 'deleted successfully' })
        }
        return res.status(401).json({ status: true, message: 'You are not authorized to delete post' });
    } catch (error) {
        return res.status(500).json({ status: true, message: error.message });
    }
}


const UpdatePostById = async (req, res) => {
    try {
        const userId = req?.user?.id;
        const postId = req?.params?.id;
        const body = req?.body;

        let bool = true;
        for (let el of Object.keys(body)) {
            if (!["title", "description"].includes(el)) {
                bool = false
            }
        }
        if (bool) {
            let { status, msg } = await updatePost(postId, userId, body);
            if (status) {
                return res.status(200).send({ status, message: msg })
            } else {
                return res.status(400).send({ status, message: msg })
            }
        } else {
            return res.status(400).send({ status: false, message: "Unwanted keys" })
        }
    } catch (error) {
        return res.status(500).json({ status: true, message: error.message });
    }
}


module.exports = {
    getUserByToken, createPostForUser, getAllPosts, likePost, getPostById, deletePostById, UpdatePostById
}