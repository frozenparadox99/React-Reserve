import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import Cart from "../../models/Cart";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";

connectDb();

export default async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Validate name, email and password
    if (!isLength(name, { min: 3, max: 20 })) {
      return res.status(422).send("Name must be 3-20 characters long");
    } else if (!isLength(password, { min: 6 })) {
      return res.status(422).send("Password must be atleast 6 characters long");
    } else if (!isEmail(email)) {
      return res.status(422).send("Email must be valid");
    }

    // 1)Check to see if the user already exists in the db
    const user = await User.findOne({ email });
    if (user)
      return res.status(422).send(`User already exists with email : ${email}`);
    // 2)We need to hash the password if the user doesnt exist
    const hash = await bcrypt.hash(password, 12);
    // 3) create user
    const newUser = await new User({
      name,
      email,
      password: hash,
    }).save();
    console.log({ newUser });
    // Create a cart for the new User
    await new Cart({
      user: newUser._id,
    }).save();

    // 4) create token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // 5)send back the token
    res.status(201).json(token);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in signing up user. Please try again");
  }
};
