const prisma = require("../model/prisma");

exports.getAllProduct = async (req, res, next) => {
  
  const result = await prisma.product.findMany({
    include:{
        productCategory:{
            include:{
                category:{
                    select:{
                        id:true,
                        name:true

                    }
                }
            }
        }
    }
  })
  res.status(200).json({ result });
};
exports.getProductById = async (req, res, next) => {
    try{

        const { id } = req.params;
        const result = await prisma.product.findUnique({
            where: {
                id: id,
            },
        });
        res.status(200).json({ result });
    }
    catch(err){
        console.log(err)
        next(err)
    }
};

exports.getSingleCategory = async (req, res, next) => {
  try{const { id } = req.params;
  const result = await prisma.category.findFirst({
    where: {
      id: +id,
    },
  include:{
    productCategory:{
      include:{
        product:true
      }
    }
  }
  });
  res.status(200).json({ result });}
  catch(err){
    console.log(err)
    next(err)
  }
};
exports.getAllCategory = async (req, res, next) => {
  const result = await prisma.category.findMany({
    include: {
      productCategory:{
        include:{
          product:{
            select:{
              title:true,
              mainPicture:true,
              fullDesc:true,
              briefDesc:true
            }
          }
        }
      }
    }
  });
  res.status(200).json({ result });
};

exports.setMainPhotoForProduct = async (req,res,next) =>{
  const {picture} = req.body
  if (!req.user.isAdmin)
  return next(createError("you are not authorized to perform this action"));
  const existProduct = await prisma.product.findFirst({
    where: {
       id: +productId , 
       title: productTitle  
    },
  });
  if (!existProduct) return next(createError("product not found", 400));

  await prisma.product.update({
    where:{
      id:existProduct.id
    },
    data:{
      mainPicture: picture
    }
  })


}
exports.setSecondaryPhotoForProduct = async (req,res,next) =>{
  const {picture} = req.body
  if (!req.user.isAdmin)
  return next(createError("you are not authorized to perform this action"));
  const existProduct = await prisma.product.findFirst({
    where: {
       id: +productId , 
       title: productTitle  
    },
  });
  if (!existProduct) return next(createError("product not found", 400));

  await prisma.product.update({
    where:{
      id:existProduct.id
    },
    data:{
      secondPicture:picture
    }
  })


}

exports.getAllPhoto = async (req,res,next) =>{
  const result =  await prisma.picture.findMany()
  res.status(200).json({result})

}

exports.getPhotoByProductId = async(req,res,next) =>{
  try{
    const {productId} = req.params

    if (!req.user.isAdmin)
    return next(createError("you are not authorized to perform this action"));
  const result = await prisma.picture.findMany({
    where:{
      productId: +productId
    }
  })

  res.status(200).json({result})
}
catch(err){
  next(err)
}


}
