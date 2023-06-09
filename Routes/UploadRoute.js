import express from 'express'
import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });
const upload = multer({ storage: storage });

const router = express.Router()

router.post('/',upload.single('file', (req,res)=>{
  try {
    return res.status(200).json({message: 'File uploaded successfully'})
  } catch (error) {
    console.log(error)
  }
}))

export default router