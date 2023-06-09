import mongoose from 'mongoose';

const PostSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        description: String,
        likes: [],
        image: String,
    },
    {
        timestamps: true
    }
);

const PostModel = mongoose.model('Posts', PostSchema)

export default PostModel