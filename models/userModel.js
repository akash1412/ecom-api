const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a your name'],
    trim: true,
    minlength: [5, 'name length must be greater than 5 characters'],
    maxlength: [20, 'name length should not contain more than 20 characters'],
  },
  role: {
    type: String,
    default: 'user',
    enum: {
      values: ['user', 'admin'],
      message: 'Please provide a valid role',
    },
  },
  email: {
    type: String,
    required: [true, 'Please provide a valid Email'],
    unique: [true, 'User with this Email already exists'],
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email'], //<-- shortHand
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    trim: true,
    minlength: [8, 'Password length must be minimum of 8 characters'],
    maxlength: [25, 'Password length shall not excced than 25 characters '],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre('save', function (next) {
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePasswords = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfterGeneratingToken = function (
  JWTtokenIssuedTime
) {
  if (this.passwordChangedAt) {
    const changedPasswordAtInSeconds =
      new Date(this.passwordChangedAt).getTime() / 1000;
    return JWTtokenIssuedTime > changedPasswordAtInSeconds;
  }

  return true;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
