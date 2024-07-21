import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userService from "../services/userService";
import appConfig from "../config/appConfig";
import { STATUS_CODES } from "../constants/statusCodes";
import { USER_ROLES } from "../constants/userRoles";
import { sendMail } from "../lib/mailer";
import mailConfig from "../config/mailConfig";
import CustomError from "../utils/CustomError";

const verifiedCodes: { [key: string]: string } = {};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new CustomError("Email not found", STATUS_CODES.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      appConfig.jwtSecret,
      { expiresIn: "7d" }
    );

    res.status(STATUS_CODES.OK).json({
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
    const usersCount = await userService.countExistingUsers();
    if (usersCount > 0) {
      throw new CustomError(
        "An admin user already exists.",
        STATUS_CODES.FORBIDDEN
      );
    }

    const hashedPassword = await bcrypt.hash(password, appConfig.bcryptSalt);

    const newUser = await userService.createUser({
      name,
      phone,
      role: USER_ROLES.ADMIN,
      email,
      password: hashedPassword,
    });

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
      throw new CustomError(
        "User with this email not found.",
        STATUS_CODES.NOT_FOUND
      );
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

const verifyResetCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, code } = req.body;

  try {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new CustomError(
        "User with this email not found.",
        STATUS_CODES.NOT_FOUND
      );
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

    // Store the verified code in the temporary store
    verifiedCodes[email] = code;

    res.status(STATUS_CODES.OK).json({ message: "Reset code verified." });
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
      throw new CustomError(
        "User with this email not found.",
        STATUS_CODES.NOT_FOUND
      );
    }

    // Check if the code is verified
    if (verifiedCodes[email] !== code) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ error: "Code not verified or expired." });
    }

    // Remove the verified code from the store after successful verification
    delete verifiedCodes[email];

    const hashedPassword = await bcrypt.hash(newPassword, appConfig.bcryptSalt);
    await userService.updateUser(user.id, { password: hashedPassword });

    res
      .status(STATUS_CODES.OK)
      .json({ message: "Password reset successfully." });
  } catch (error) {
    next(error);
  }
};

const resetPasswordWithCurrent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new CustomError(
        "User with this email not found.",
        STATUS_CODES.NOT_FOUND
      );
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ error: "Current password is incorrect." });
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
  verifyResetCode,
  resetPassword,
  resetPasswordWithCurrent,
};
