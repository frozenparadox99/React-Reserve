import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

connectDb();

export default async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1) Check to see if a user exists with the provided email
    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    // 2) If not return error
    if (!user) return res.status(404).send("No user exists with that email");
    // 3) check to see if the user's password  matches the one in db
    console.log(password);
    console.log(user.password);
    const passwordsMatch = await bcrypt.compare(password, user.password);
    // 4) if so, generate a token
    if (passwordsMatch) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      // 5) send that token to the client
      console.log(token);
      res.status(200).json(token);
    } else {
      res.status(401).send("Passwords do not match");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in user");
  }
};
