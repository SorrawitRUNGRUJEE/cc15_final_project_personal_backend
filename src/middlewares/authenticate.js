const Jwt = require('jsonwebtoken')
const createError = require('../utils/create_error')
const prisma  = require('../model/prisma')


module.exports = async (req,res,next) =>{
    try {
        const authorization = req.headers.authorization;
        if (!authorization || !authorization.startsWith("Bearer "))
          return next(createError("unauthenticated", 401));
        const token = authorization.split(" ")[1];
        const payload = Jwt.verify(token, process.env.JWT_SECRET_KEY || "lkdsjgn");
    
        const user = await prisma.user.findUnique({
          where: {
            id: payload.id,
          },
          include:{
            order:{
              select:{
                paymentStatus:true
              }
            }
          }
        });
        
        if (!user) return next(createError("unauthenticated", 401));
        req.user = user;
        
        next();
      } catch (err) {
      
        if(err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError'){
            err.code = 401
        }
        next(err);
      }

}