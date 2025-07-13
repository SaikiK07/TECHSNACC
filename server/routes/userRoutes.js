import express from 'express'
import userauth from '../middlewares/userauth.js'
import { getUserData, updateUser } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get('/data',userauth,getUserData)

userRouter.put("/update", userauth, updateUser);

export default userRouter