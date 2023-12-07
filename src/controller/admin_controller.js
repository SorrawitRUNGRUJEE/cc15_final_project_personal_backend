
const {
  productSchema,
  categorySchema,
  adminSchema
} = require("../validation/admin_validator");
const prisma = require("../model/prisma");
const bcrypt = require("bcryptjs");
const { upload } = require("../utils/upload");
const createError = require("../utils/create_error");
const fs = require("fs/promises");

exports.addAdmin = async (req, res, next) => {
  // console.log(req.body)
  const { isSuperAdmin } = req.user;
  try {
    if (!isSuperAdmin)
      return res
        .status(401)
        .json({ msg: " you are not authorized to perfom this action" });
    const { value, error } = adminSchema.validate(req.body);
    if (error) return next(error);

    const existEmail = await prisma.user.findUnique({
      where: {
        email: value.email,
      },
    });
    if (existEmail)
      return res.status(400).json({ msg: "email already in used" });
    const existUsername = await prisma.user.findUnique({
      where: {
        username: value.username,
      },
    });

    if (existUsername)
      return res.status(400).json({ msg: "username already in used" });

    value.password = await bcrypt.hash(value.password, 12);
    value.isAdmin = true;

    const result = await prisma.user.create({
      data: value,
    });
    res.status(201).json({ msg: "admin added", result });
  } catch (err) {
    next(err);
  }
};

exports.removeAdmin = async (req, res, next) => {
  const { isSuperAdmin } = req.user;
  const {username,id}  = req.params
  try {
    if (!isSuperAdmin)
      return res
        .status(401)
        .json({ msg: " you are not authorized to perfom this action" });
    const exist = await prisma.user.findFirst({
      where: {
        OR: [{ id: +id  }, { username: username}],
      },
    });
    if (!exist) return next(createError("this user does not exist", 400));
    const isAdmin = await prisma.user.findUnique({
      where: {
        id: +exist.id,
        isAdmin: true,
      },
    });
    if (isAdmin) {
      if (isAdmin.isSuperAdmin) {
        return next(createError("cannot delete super admin", 400));
      }
    }
    if (!isAdmin) return next(createError("this user is not admin", 400));

    const result = await prisma.user.delete({
      where: {
        id: isAdmin.id,
      },
    });

    res.json({ msg: "admin deleted",result });
  } catch (err) {
    next(err);
  }
};
exports.getAllAdmin = async (req,res,next) =>{
  const result = await prisma.user.findMany({
    where:{
      isAdmin:true
    }
  })

  for(let i of result){
    delete i.password
  }
  
  res.status(200).json({msg:"admin get",result})

}

exports.getProduct = async (req, res, next) => {
  try {
    if (!req.user.isAdmin)
      return next(
        createError("you are not authorized to perform this action", 400)
      );
    const result = await prisma.product.findMany({
      include: {
        productCategory: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};
exports.addProduct = async (req, res, next) => {
  try {
    if (!req.user.isAdmin)
      return next(
        createError("you are not authorized to perform this action", 400)
      );
    const { value, error } = productSchema.validate(req.body);
    if (error) return next(error);
    const existProduct = await prisma.product.findFirst({
      where: {
        title: value.title,
      },
    });
    if (existProduct) return next(createError("product already exist", 400));
    const result = await prisma.product.create({
      data: value,
    });
    res.status(200).json({ msg: "product added", result });
  } catch (err) {
    console.log(err);
  }
};
exports.modifyProduct = async (req, res, next) => {
  try {
    const { id, title } = req.body;
   
    const newData = req.body;
    if (!req.user.isAdmin)
      return next(createError("you are not authorized to perform this action"));
    const existProduct = await prisma.product.findFirst({
      where: {
        OR: [
          {
            title: title,
          },
          {
            id: +id,
          },
        ],
      },
    });
    if (!existProduct) return next(createError("product does not exist", 400));
    if(newData.price){
      const newDataPrice = +newData.price
      newData.price = newDataPrice 
      const modifiedProduct = { ...existProduct, ...newData };
    const productId =  +modifiedProduct.id
    modifiedProduct.id = productId
    const result = await prisma.product.update({
      where: {
        id: existProduct.id,
      },
      data: modifiedProduct,
    });
    return res.status(200).json({ msg: "product modified", result });

    }
    const modifiedProduct = { ...existProduct, ...newData };
    const productId =  +modifiedProduct.id
    modifiedProduct.id = productId
    const result = await prisma.product.update({
      where: {
        id: existProduct.id,
      },
      data: modifiedProduct,
    });
    res.status(200).json({ msg: "product modified", result });
    

  } catch (err) {
    next(err);
  }
};
exports.deleteProduct = async (req, res, next) => {
  const { id, title } = req.params;
  if (!req.user.isAdmin)
    return next(createError("you are not authorized to perform this action"));
  const existProduct = await prisma.product.findFirst({
    where: {
      OR: [
        {
          title: title,
        },
        {
          id: +id,
        },
      ],
    },
  });
  if (!existProduct) return next(createError("product does not exist", 400));
  const result = await prisma.product.delete({
    where: {
      id: existProduct.id,
    },
  });

  res.status(200).json({ msg: "product deleted", result });
};
exports.getCategory  = async (req,res,next) =>{
  try {
    if (!req.user.isAdmin)
      return next(
        createError("you are not authorized to perform this action", 400)
      );
      const result = await prisma.category.findMany()

      res.status(200).json({result})
      
    }
    catch(err){

    }

}
exports.addCategory = async (req, res, next) => {
  try {
    if (!req.user.isAdmin)
      return next(createError("you are not authorized to perform this action"));
    const { value, error } = categorySchema.validate(req.body);

    if (error) return next(error);
    const existCategory = await prisma.category.findFirst({
      where: {
        name: value.name,
      },
    });
    if (existCategory) return next(createError("category already exist", 400));
    const result = await prisma.category.create({
      data: {
        name: value.name,
      },
    });
    res.status(200).json({ msg: "category added", result });
  } catch (err) {
    console.log(err);
  }
};
exports.modifyCategory = async (req, res, next) => {
  const { id, name, newName } = req.body;
  if (!req.user.isAdmin)
    return next(createError("you are not authorized to perform this action"));
  const { value, error } = categorySchema.validate(req.body);
  if (error) return next(error);
  const existCategory = await prisma.category.findFirst({
    where: {
      OR: [
        {
          name: value.name,
        },
        {
          id: value.id,
        },
      ],
    },
  });
  if (!existCategory)
    return next(createError("this category does not exist", 400));

  const category = await prisma.category.update({
    where: {
      id: existCategory.id,
    },
    data: {
      name: newName,
    },
  });

  const product = await prisma.product.findMany({
    include: {
      productCategory: {
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  res.status(200).json({ msg: "category modified", product,category });
};
exports.deleteCategory = async (req, res, next) => {
  try {
  const { value, error } = categorySchema.validate(req.params);
  if (error) return next(error);
    if (!req.user.isAdmin)
      return next(createError("you are not authorized to perform this action"));
    const existCategory = await prisma.category.findFirst({
      where: {
        OR: [
          {
            name: value.name,
          },
          {
            id: +value.id,
          },
        ],
      },
    });
    if (!existCategory)
      return next(createError("this category does not exist", 400));
    const result = await prisma.category.delete({
      where: {
        id: existCategory.id,
      },
    });

    res.status(200).json({ msg: "category deleted", result });
  } catch (err) {
    console.log(err);
  }
};
exports.addProductCategory = async (req, res, next) => {
  try {
    const { productId, productTitle, categoryName, categoryId } = req.body;
    if (!req.user.isAdmin)
      return next(createError("you are not authorized to perform this action"));
    console.log(productId,productTitle)
    const existProduct = await prisma.product.findUnique({
      where: {
         id: +productId ,  
         title: productTitle 
      }
    });
    
    if (!existProduct) return next(createError("product not found", 400));
    const existCategory = await prisma.category.findUnique({
      where: {
         id: +categoryId ,  
         name: categoryName 
      },
    });
    if (!existCategory) return next(createError("category not found", 400));

    const existProductCategory = await prisma.productCategory.findMany({
      where: {
        productId: existProduct.id,
        categoryId: existCategory.id,
      },
    });
    
    if (existProductCategory.length > 0)
      return next(createError("this product-category is already added "));
     await prisma.productCategory.create({
      data: {
        categoryId: existCategory.id,
        productId: existProduct.id,
      },
    });

    const result = await prisma.product.findMany({
      include: {
        productCategory: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({ msg: "product category added", result });
  } catch (err) {
    console.log(err);
  }
};
exports.deleteProductCategory = async (req, res, next) => {
  try {
    const { productId, productTitle, categoryName, categoryId } = req.params;
    console.log(productId, productTitle, categoryName, categoryId)
    if (!req.user.isAdmin)
      return next(createError("you are not authorized to perform this action"));
    const existProduct = await prisma.product.findFirst({
      where: {
        OR: [{ id: +productId }, { title: productTitle }],
      },
    });
    if (!existProduct) return next(createError("product not found", 400));
    const existCategory = await prisma.category.findFirst({
      where: {
        OR: [{ id: +categoryId }, { name: categoryName }],
      },
    });
    if (!existCategory) return next(createError("category not found", 400));

    const existProductCategory = await prisma.productCategory.findFirst({
      where: {
        productId: +existProduct.id,
        categoryId: +existCategory.id,
      },
    });
    if (!existProductCategory)
      return next(createError("this product-category does not exist", 400));
     await prisma.productCategory.delete({
      where: {
        id:existProductCategory.id
      },
    });

    const product = await prisma.product.findMany({
      include: {
        productCategory: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({ msg: "product-category removed", product });
  } catch (err) {
    next(err);
  }
};
exports.getAllPhoto = async (req,res,next) =>{
  const result =  await prisma.picture.findMany()
  res.status(200).json({result})

}

exports.addProductPhoto = async (req, res, next) => {
  try {
  
    const { productId, productTitle } = req.params;
    if (!req.user.isAdmin)
      return next(createError("you are not authorized to perform this action"));
    if (!req.files) return next(createError("image required", 400));
    const existProduct = await prisma.product.findFirst({
      where: {
         id: +productId , 
         title: productTitle  
      },
    });
    
    if (!existProduct) return next(createError("product not found", 400));
    const data = { productId: existProduct.id };

    for (i of req.files) {
      data.picture = await upload(i.path);

      await prisma.picture.create({
        data: data,
      });
    }
    const result =  await prisma.picture.findMany()
    res.status(200).json({ msg: "picture added",result});
  } catch (err) {
    next(err);
  } finally {
    if (req.files)
      for (i of req.files) {
        fs.unlink(i.path);
      }
  }
};

exports.deleteProductPhoto = async (req, res, next) => {
  const {title, id,photoId} = req.params
  try{
    if (!req.user.isAdmin)
    return next(createError("you are not authorized to perform this action"));
    const existProduct = await prisma.product.findFirst({
      where: {
          title: title,  
            id: +id,
      },
    });
    if (!existProduct) return next(createError("product does not exist", 400));
    
     await prisma.picture.delete({
      where:{
        id: +photoId,
    
      }
    })

    
    const result =  await prisma.picture.findMany()
    res.status(200).json({msg:"Photo deleted",result})

  }catch(err){
    console.log(err)
  }



};


exports.approvePayment = async (req,res,next) =>{
  try{
    const {id} = req.body
    await prisma.order.update({
      where:{
        id: +id
      },
      data:{
        paymentStatus:true
      }
    })
    const result = await prisma.order.findMany()

    res.status(200).json({msg:"payment confirm",result})

  }
  catch(err){
    next(err)
  }

}

exports.declinePayment = async (req,res,next) =>{
  try{
    console.log("DECLINE")
    const {deId} = req.params
    await prisma.order.delete({
      where:{
        id: +deId
      }
    })
    const result = await prisma.order.findMany()
    res.status(200).json({result})
  }
  catch(err){
    next(err)
  }
  

}

exports.getOrder = async ( req,res,next) =>{

try{
const result = await prisma.order.findMany({
})

res.status(200).json({result})
}catch(err){
  next(err)
}

}