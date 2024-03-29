const createError = require("../utils/create_error");
const { registerSchema, loginSchema } = require("../validation/auth_validator");
const bcrypt = require("bcryptjs");
const prisma = require("../model/prisma");
const Jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) return next(error);
    const existEmail = await prisma.user.findUnique({
      where: {
        email: value.email,
      },
    });
    if (existEmail) return next(createError("email already in used",400));
    const existUsername = await prisma.user.findUnique({
      where: {
        username: value.username,
      },
    });

    if (existUsername)
      return next(createError("username already in used", 400))
    value.password = await bcrypt.hash(value.password, 12);
    await prisma.user.create({
      data: value,
    });
    res.status(200).json({ msg: "registration success" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) return next(createError(error, 400));
    const user = await prisma.user.findFirst({
      where: {
        username: value.username,
      },
    });
    if (!user) return next(createError("invalid credential", 400));
    const isMatch = await bcrypt.compare(value.password, user.password);
    if (!isMatch) return next(createError("invalid credentials", 400));
    const id = user.id;
    const accessToken = Jwt.sign(
      { id },
      process.env.JWT_SECRET_KEY || "kjasbdf",
      { expiresIn: process.env.JWT_EXPIRES }
    );
    delete user.password
    res.status(200).json({ msg: "access granted", accessToken, user });
  } catch (err) {
    next(createError(err, 500));
  }
};

exports.getUser = async (req,res,next) =>{
  try{

    const {user} = req
    

    const order = user.order.filter(el => !el.paymentStatus)
  
    const newUser = {...user,order}
    
    delete newUser.password
    res.json({user:newUser})
}
catch(err){
    next(createError(err,500))
}

}

exports.changePassword =  async (req,res,next) =>{
  try{
 
  }
  catch(err) {
    next(err)
  }
}
