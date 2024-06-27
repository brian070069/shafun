const { customError } = require("../Utils/customError");
const User = require("../Models/auth.model");
const bcrypt = require("bcrypt");
const hashPassword = require("../Utils/hashpassword");
const { generateJwt } = require("../Utils/generatejwt");
const {
  registerValidationSchema,
  loginValidationSchema,
} = require("../Models/validationSchemas");

const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  const { error, value } = registerValidationSchema.validate(req.body);
  const validationError = error?.details[0]?.message;

  if (error) {
    return next(customError(400, validationError));
  }

  try {
    const user = await User.findOne({ $and: [{ username }, { email }] });
    if (user) {
      return next(customError(409, "User already exist"));
    }

    const hashedPassword = hashPassword(password);
    const newUser = new User({ username, email, password: hashedPassword });
    const { password: p, betList, ...rest } = newUser._doc;
    const secretkey = process.env.JWTSECRET;
    const accessToken = generateJwt(rest, secretkey, { expiresIn: "1h" });
    await newUser.save();
    res.cookie("accessToken", accessToken, { secure: true }).json(rest);
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const { error, value } = loginValidationSchema.validate(req.body);
  if (error) {
    return next(customError(400, "Please provide all required fields"));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(customError(404, "user does not exist"));
    }

    const hashedPassword = user.password;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      return next(customError(404, "wrong password"));
    }

    const { password: p, betList, ...rest } = user._doc;
    const secretkey = process.env.JWTSECRET;
    const accessToken = generateJwt(rest, secretkey, { expiresIn: "30d" });
    res.cookie("accessToken", accessToken, { secure: true }).json(rest);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signIn,
  signUp,
};
