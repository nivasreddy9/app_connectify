const mongoose = require("mongoose");
const validator = require("validator");

const details = new mongoose.Schema(
  {
    Name: { 
      type: String,
      required: true,
      unique: true,
      minlength: 3,  
    }, 
    Email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    Phone: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error("Not a correct number");
        }
      },
    },
    Password: {
      required: true,
      type: String,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong");
        }
      },
    },
    photoUrl: {
      type: String, 
      required: true,
      validate: {
        validator: function (value) {
          return validator.isURL(value, { protocols: ["http", "https"], require_protocol: true });
        },
        message: "Invalid photo URL",
      },
    },
    Gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"], 
      set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
    },
    Age: {
      type: Number,
      required: true,
      min: 13, 
    },
    About: {
      type: String,
      required: false, 
      maxlength: 500,
      trim: true, 
    },
  },
  { timestamps: true }
);

const Subscriber = mongoose.model("Subscriber", details);
module.exports = Subscriber;
