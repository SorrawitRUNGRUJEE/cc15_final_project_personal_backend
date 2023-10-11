const createError = require("../utils/create_error");
const { registerSchema } = require("../validation/auth_validator");
const bcrypt = require("bcryptjs");
const prisma = require("../model/prisma");

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    console.log(value);
    if (error) return next(createError(error, 400));
    const existEmail = await prisma.user.findUnique({
      where: {
        email: value.email,
      },
    });
    if (existEmail)
      return res.status(400).json({ msg: "email already in used" });
    if (error) return next(createError(error, 400));
    const existUsername = await prisma.user.findUnique({
      where: {
        username: value.username,
      },
    });

    if (existUsername)
      return res.status(400).json({ msg: "username already in used" });
    value.password = await bcrypt.hash(value.password, 12);
    const user = await prisma.user.create({
      data: value,
    });

    res.status(200).json({ msg: "registration completed" });
  } catch (err) {
    next(err);
  }
};
