const { registerSchema } = require("../validation/auth_validator");
const prisma = require("../model/prisma");
const bcrypt = require("bcryptjs");
const createError = require("../utils/create_error");

exports.addAdmin = async (req, res, next) => {
  const { isSuperAdmin } = req.user;
  try {
    if (!isSuperAdmin)
      return res
        .status(401)
        .json({ msg: " you are not authorized to perfom this action" });
    const { value, error } = registerSchema.validate(req.body);
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
  const { id, username } = req.body;
  try {
    if (!isSuperAdmin)
      return res
        .status(401)
        .json({ msg: " you are not authorized to perfom this action" });
    const exist = await prisma.user.findFirst({
      where: {
        OR: [{ id: +id || 0 }, { username: username || "" }],
      },
    });
    if (!exist) return next(createError("this user does not exist", 400));
    const isAdmin = await prisma.user.findUnique({
      where: {
        id: +exist.id,
        isAdmin: true,
      },
    });
    if(isAdmin){
        if (isAdmin.isSuperAdmin){
            return next(createError("cannot delete super admin", 400));
        }
    }
    if (!isAdmin) return next(createError("this user is not admin", 400));

    await prisma.user.delete({
        where:{
            id: isAdmin.id
        }
    })

    res.json({ msg: "delete admin" });
  } catch (err) {
    next(err);
  }
};
