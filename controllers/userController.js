const User = require('../models/userModel');
const AppError = require('../utils/appError');

const filter = (reqObj, ...allowedFields) => {
  let newObj = {};
  console.log(Object.keys(reqObj));
  Object.keys(reqObj).forEach((el) => {
    if (allowedFields.includes(el)) {
      console.log(reqObj[el]);
      newObj[el] = reqObj[el];
    } else {
      return;
    }
  });

  return newObj;
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError('User with this ID,does not exists', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    // cannot update password or any other sensitive stuff
    // if send password or passwordConfirm data in req.body send error

    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'cannot update password,Please use /updatePassword route to update password',
          400
        )
      );
    }

    const filteredBody = filter(req.body, 'name', 'email');

    const user = await User.findByIdAndUpdate(req.user._id, filteredBody);

    res.status(200).json({
      status: 'success',
      message: 'user details updated',
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMe = async (req, res, next) => {
  try {
    console.log(req.user);

    await User.findByIdAndUpdate(
      req.user._id,
      { active: false },
      { runValidators: true, new: true }
    );

    res.status(204).status({
      status: 'success',
    });
  } catch (error) {
    next(error);
  }
};
