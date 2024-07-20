import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userService from "../services/userService";
import appConfig from "../config/appConfig";
import { STATUS_CODES } from "../constants/statusCodes";
import { USER_ROLES } from "../constants/userRoles";
import { sendMail } from "../lib/mailer";
import mailConfig from "../config/mailConfig";

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    // Step 1: Retrieve user from database by email
    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ error: "Invalid email or password" });
    }

    // Step 2: Compare the provided password with the stored password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ error: "Invalid email or password" });
    }

    // Step 3: Generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      appConfig.jwtSecret,
      { expiresIn: "7d" }
    );

    // Step 4: Return the token in the response
    res
      .status(STATUS_CODES.OK)
      .json({
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          email: user.email,
          phone: user.phone,
        },
        access_token: token,
      });
  } catch (error) {
    next(error);
  }
};

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { name, phone, email, password } = req.body;

  try {
    // Check if there are any users in the database
    const usersCount = await userService.countExistingUsers();
    if (usersCount > 0) {
      return res
        .status(STATUS_CODES.FORBIDDEN)
        .json({ error: "An admin user already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, appConfig.bcryptSalt);

    // Create a new user with ADMIN role
    const newUser = await userService.createUser({
      name,
      phone,
      role: USER_ROLES.ADMIN,
      email,
      password: hashedPassword,
    });

    // Return the created user in the response
    res.status(STATUS_CODES.CREATED).json(newUser);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ error: "User with this email not found." });
    }

    const resetToken = Math.floor(1000 + Math.random() * 9000).toString();
    await userService.savePasswordResetToken(user.id, resetToken);

    try {
      await sendMail({
        from: mailConfig.user,
        to: user.email,
        subject: "Ghazala Password Reset Code",
        text: `Your password reset code is: ${resetToken}`,
        html: `<p>Your password reset code is: <strong>${resetToken}</strong></p>`,
      });
      res
        .status(STATUS_CODES.OK)
        .json({ message: "Password reset code sent to your email." });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ error: "User with this email not found." });
    }

    const isTokenValid = await userService.verifyPasswordResetToken(
      user.id,
      code
    );
    if (!isTokenValid) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ error: "Invalid or expired password reset token." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, appConfig.bcryptSalt);
    await userService.updateUser(user.id, { password: hashedPassword });

    res
      .status(STATUS_CODES.OK)
      .json({ message: "Password reset successfully." });
  } catch (error) {
    next(error);
  }
};

export default {
  signIn,
  signUp,
  forgotPassword,
  resetPassword,
};
