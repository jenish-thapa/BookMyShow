const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "partner"],
      required: true,
      default: "user",
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.statics.matchPassword = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    return { error: "User not found" };
  }
  const validatePassword = await bcrypt.compare(password, user.password);
  if (!validatePassword) {
    return { error: "Invalid password" };
  }
  return { message: "User logged in" };
};

const User = mongoose.model("User", userSchema);

module.exports = User;
