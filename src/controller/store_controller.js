const prisma = require("../model/prisma");
const createError = require("../utils/create_error");
const { upload } = require("../utils/upload");
const fs = require("fs/promises")

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
          product:true
        }
      }
    }
  });
  res.status(200).json({ result });
};

exports.setMainPhotoForProduct = async (req,res,next) =>{
  try{  
    const {productId,pictureId} = req.params
    if (!req.user.isAdmin)
    return next(createError("you are not authorized to perform this action"));
    const existProduct = await prisma.product.findUnique({
      where:{
        id: +productId
      }
    })
    if (!existProduct) return next(createError("product not found", 400));
  
    const existPicture = await prisma.picture.findUnique({
      where:{
        id:+pictureId
      }
    })
    if(!existPicture) return next(createError("picture not found",400))
  
     let result = await prisma.product.update({
      where:{
        id:existProduct.id
      },
      data:{
        mainPicture: existPicture.picture
      }
    }) 
  
    
  
    res.status(200).json({result})
  }
  catch(err){
    next(err)
  }

}
exports.setSecondaryPhotoForProduct = async (req,res,next) =>{
  try{  
  const {productId,pictureId} = req.params
  if (!req.user.isAdmin)
  return next(createError("you are not authorized to perform this action"));
  const existProduct = await prisma.product.findUnique({
    where:{
      id: +productId
    }
  })
  if (!existProduct) return next(createError("product not found", 400));

  const existPicture = await prisma.picture.findUnique({
    where:{
      id:+pictureId
    }
  })
  if(!existPicture) return next(createError("picture not found",400))

   let result = await prisma.product.update({
    where:{
      id:existProduct.id
    },
    data:{
      secondPicture: existPicture.picture
    }
  }) 

  

  res.status(200).json({result})
}
catch(err){
  next(err)
}

}

exports.getAllPhoto = async (req,res,next) =>{
  const result = await prisma.picture.findMany({
    include:{
      product:true
    }
  })
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

exports.addToBasket = async (req,res,next) =>{
  const {productId} = req.params
  try{
    if(!req.user) return next(createError("only member is allowed"))
    const existProduct = await prisma.product.findUnique({
  where:{
    id: +productId
  }})
  if(!existProduct) return next(createError("this product does not exist",400))

  const existList = await prisma.basket.findFirst({
    where:{
      productId:existProduct.id,
      userId:req.user.id
    }
  })
  if(existList) return next(createError("this product has already beed added to the basket",400))

  await prisma.basket.create({
    data:{
      userId:req.user.id,
      productId: existProduct.id
    }
  })
  const result = await prisma.basket.findMany()
  res.status(200).json({result})


  }
  catch(err){
    next(err)
  }


}

exports.getBasket = async (req,res,next) =>{
  try{
    const result = await prisma.basket.findMany({
      include:{
        product:true
      }
    })
    res.status(200).json({result})
  }
  catch(err){

  }
 
}

exports.deleteSingleBasket = async (req,res,next) => {
  try{
    const {productId} = req.params
    const existBasketItem = await prisma.basket.findFirst({
      where:{
        userId:req.user.id,
        productId: +productId
      }
    })
    if(!existBasketItem) return next(createError("Product not found on this user's basket"))
    const result = await prisma.basket.delete({
      where:{
        id:existBasketItem.id
      }
    })
    res.status(200).json({result})

  }
  catch(err){
    next(err)

  }

}

exports.deleteAllBasket =  async (req,res,next) =>{
  try{
    await prisma.basket.deleteMany({
      where:{
        userId:req.user.id
      }
    })

    res.status(200).json({message:"basket has been cleared"})

  }
  catch(err){
    
  }
}

exports.addToWishList = async (req,res,next) =>{
  const {productId} = req.params
  try{
    if(!req.user) return next(createError("only member is allowed"))
    const existProduct = await prisma.product.findUnique({
  where:{
    id: +productId
  }})
  if(!existProduct) return next(createError("this product does not exist",400))

  const existList = await prisma.wishlist.findFirst({
    where:{
      productId:existProduct.id,
      userId:req.user.id
    }
  })
  if(existList) return next(createError("this product has already beed added to the wishlist",400))

  await prisma.wishlist.create({
    data:{
      userId:req.user.id,
      productId: existProduct.id
    }
  })
  const result = await prisma.wishlist.findMany()
  res.status(200).json({result})
  
}
catch(err){
  next(err)
}
}


exports.createOrder = async (req,res,next) => {
  try{
    const {data} = req.body

    console.log(data)
  
    const unpaid_order = await prisma.order.findFirst({
      where:{
        userId:req.user.id,
        paymentStatus:false
      }
    })
    if(unpaid_order) return next(createError("please submit your payment before creating order",400))
    const order_item_data = []
    let order_result = await prisma.order.create({
      data:{
        totalPrice: data.totalPrice,
        userId:req.user.id,
      }
  
    })
    delete data.totalPrice
    for(let i in data){
      if(data[i].multiplier > 1){
        do{
            data[i].multiplier -= 1
            order_item_data.push({orderId:order_result.id,productId:data[i].productId})
  
        }while( data[i].multiplier > 1)
        
      }
      order_item_data.push({orderId:order_result.id,productId:data[i].productId})
      console.log("order item",order_item_data)
    }
    await prisma.orderItem.createMany({
      data:order_item_data
    })

    const order = await prisma.order.findFirst({
      where:{
        userId:req.user.id,
        paymentStatus:false
      }
    })

  
    const order_item = await prisma.orderItem.findMany({
      where:{
        orderId:order.id
      },
      include:{
        product:true
      }
    })
  
    res.status(200).json({order,order_item})

  }
  catch(err){
    next(err)
  }



}


exports.getOrder = async (req,res,next) =>{
  try{

    const order = await prisma.order.findFirst({
      where:{
        userId:req.user.id,
        paymentStatus:false
      }
    })

  
    const order_item = await prisma.orderItem.findMany({
      where:{
        orderId:order.id
      },
      include:{
        product:true
      }
    })



    

    res.status(200).json({order,order_item})

  }
  catch(err){
    next(err)
  }

}


exports.submitPayment = async (req,res,next) =>{

  try{
    const existOrder = await prisma.order.findFirst({
        where:{
          userId: req.user.id,
          paymentStatus:false
        }
    })
    if(!existOrder) return next(createError("no order by this user",400))
    const paymentSlip = await upload(req.file.path)
   await prisma.order.update({
    where:{
      id:existOrder.id
    },
    data:{
      paymentSlip:paymentSlip
    }
  })

  res.status(200).json({msg:"payment slip recieved"})

  }
  catch(err){
    next(err)
  }
  finally{
    fs.unlink(req.file.path)

  }

  
  

}