import PostModel from "../Models/postModel.js";
import mongoose from 'mongoose';
import UserModel from '../Models/userModel.js'

//Create new Post
export const createPost = async (req, res) => {
    const newPost = new PostModel(req.body);

    try {
        await newPost.save()
        res.status(200).json(newPost)
    } catch (error) {
        res.status(500).json(error)
    }

}

//Get a post
export const getPost = async (req, res) => {

    const id = req.params.id;

    try {
        const post = await PostModel.findById(id)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
}

//update a post

export const updatePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body

    try {
        const post = await PostModel.findByIdAndUpdate(id)
        if (post.userId === userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json('Post updated')
        } else {
            res.status(401).json('You are not authorized to update this post')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

//delete a post

export const deletePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body
    try {
        const post = await PostModel.findByIdAndUpdate(id)
        if (post.userId === userId) {
            await post.deleteOne({ $set: req.body })
            res.status(200).json('Post deleted')
        } else {
            res.status(401).json('You are not authorized to update this post')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// like/dislike a post

export const likePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;

    try {

        const post = await PostModel.findById(id)
        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } })
            res.status(200).json('Post liked')
        } else {
            await post.updateOne({ $pull: { likes: userId } })
            res.status(200).json('Post disliked')
        }

    } catch (error) {
        res.status(500).json(error)
    }
}

// Get timeline posts

export const getTimeLinePosts = async (req, res) => {
    const userId = req.params.id;

    try {
        const currentUserPosts = await PostModel.find({ userId: userId })
        const followingPosts = await UserModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: 'following',
                    foreignField: 'userId',
                    as: 'followingPosts'
                }
            },
            {
                $project: {
                    followingPosts : 1,
                    _id: 0
                }
            }
        ])
        res.status(200).json(currentUserPosts.concat(...followingPosts[0].followingPosts)
        .sort((a,b)=>{
            return b.createdAt - a.createdAt
        })
        )
    } catch (error) {
        res.status(500).json(error)
    }
}