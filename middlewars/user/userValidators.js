import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { isValidObjectId } from "mongoose";

import userSchema from '../../schemas/userSchema.js';
import User from '../../models/user.js';


dotenv.config();
const { ACCESS_SECRET_KEY } = process.env;

// const isEmptyBody = (req, res, next) => {
//     const keys = Object.keys(req.body);
//      if (keys.length === 0) {
//        res.status(400).json({ message: 'missing fields' });
//        return
//     }
//     next();
// }
// export const validateBody = schema =>{
//   const func =(req, res, next)=>{
//       const {error} = schema.validate(req.body);
//       if(error){
//           res.status(400).json({message:error.message});
//           return;
//       }
//       next();
//   }
//   return func;
// }

const authenticate = async (req, res, next) => {
    const { authorization = ""} = req.headers;
    const [bearer, accessToken] = authorization.split(" ");
    if (bearer !== "Bearer") {
        res.status(401).json({ message: `Not authorized` });
        return;
    }
    try {
        const { id } = jwt.verify(accessToken, ACCESS_SECRET_KEY);
        const user = await User.findById(id);
       
        if (!user || !user.accessToken) {
            res.status(401).json({ message: `Not authorized` });
            return;
      }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: error.message });
        return;
    }
}

// const refreshToken = (req, res, next) => {
//   const { error } = userSchema.userRefreshSchema.validate(req.body);
//   if (error) {
//     res.status(400).json({ message: error.message});
//     return;
//   }
//   next();
// } 

// const isValidId = (req, res, next) => {
//     const {id } = req.params;
//     if (!isValidObjectId(id)) {
//       res.status(404).json({message: `${id} is not valid`})
//       return
//     }
//     next();
// }

const isTheme = (req, res, next) => {
  const { error } = userSchema.userThemeSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: 'select theme from [dark, light, violet]' });
    return;
  }
  next();
}

const userUpdateValidator = (req, res, next) => {
  const { error } = userSchema.userUpdateSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }
  next();
}

// const userUpdatePhoto = (req, res, next) => {
//   const { error } = userSchema.userPhotoSchema.validate(req);
//   if (error) {
//     res.status(400).json({ message: error.message  });
//     return;
//   }
//   next();
// }


const userLetter = (req, res, next) => {
  const { error } = userSchema.userLetterSchema.validate(req.body);
 
  if (error) {
    res.status(400).json({ message: error.message  });
    return;
  }
  next();
}


export default {
  // isEmptyBody,
  // userRegisterValidator,
  // userLoginValidator,
  authenticate,
  // refreshToken,
  // isValidId,
  isTheme,
  userUpdateValidator,
  // userUpdatePhoto,
  userLetter
}