const mongoose = require("mongoose");
const { randomBytes, createHmac } = require("crypto");

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

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16);
  const hashedPass = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPass;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
