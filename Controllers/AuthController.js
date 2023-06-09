import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

//Regists new users
export const registerUser = async (req, res) => {

    const encryptPassword = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, encryptPassword)
    req.body.password = hashedPassword
    const newUser = new UserModel(req.body);
    const {username} = req.body

    try {

        const oldUser = await UserModel.findOne({username})
        if(oldUser){
            return res.status(400).json({message: "username is already registered!"})
        }
         const user = await newUser.save()

        const token = jwt.sign ({
            username: user.username,
            id: user._id
        }, process.env.JWT_KEY, {expiresIn: '1h'})
        res.status(200).json({user, token})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

//Login users

export const loginUser = async (req,res)=>{
    const {username, password} = req.body;

    try{
        const user = await UserModel.findOne({
            username: username
        })

        if(user){
            const isValid = await bcrypt.compare(password, user.password)

            if(!isValid){
             res.status(400).json({message: "Invalid username or password!"})
            }else{
                const token = jwt.sign ({
                    username: user.username,
                    id: user._id
                    }, process.env.JWT_KEY, {expiresIn: '1h'})
                    res.status(200).json({user, token})
            }
        } else {
            res.status(404).json("User doesn't exist")
        }
    }catch(error){
        res.status(500).json({ message: error.message })
    }
}
