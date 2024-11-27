const {createComment, createFollow, acceptRequest} = require("../models");

const createCommentForPost = async(req, res) => {
    try {
       let postId = req.params.id;
       const userId = req?.user?.id;
       let comment = req.body.comment;
       let insertComment = await createComment(comment,postId,userId);
       return res.status(200).json({status : true, message : insertComment});
    } catch (error) {
        return res.status(500).json({ status: true, message: error.message });
    }
}

// delete comment auth

// edit comment by auth


//follow userById
const sendFollowRequest = async(req, res) => {
    try {
       let followedBy = req.params.userId;
       let follow = req?.user?.id;
       await createFollow(followedBy, follow);
       return res.status(200).json({status : true, message : "Sent follow request"});
    } catch (error) {
        return res.status(500).json({ status: true, message: error.message });
    }
}

const acceptFollowRequest = async(req, res) => {
    try {
        let followedBy = req.params.userId;
        let follow = req?.user?.id;
        let insertComment = await acceptRequest(followedBy, follow);
        return res.status(200).json({status : true, message : insertComment});
     } catch (error) {
         return res.status(500).json({ status: true, message: error.message });
     }
}


module.exports = {
    createCommentForPost,
    sendFollowRequest,
    acceptFollowRequest
}