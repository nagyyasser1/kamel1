import { Role } from "@prisma/client";
import prisma from "../prisma";
import CustomError from "../utils/CustomError";
import { STATUS_CODES } from "../constants/statusCodes";

interface CreateUserDTO {
  name: string;
  role: any;
  phone: string;
  email: string;
  password: string;
}

const getAllUsers = async (page: number, limit: number, role?: string) => {
  const skip = (page - 1) * limit;
  const where = role ? { role: role as Role } : {};

  return await prisma.user.findMany({
    where,
    skip,
    take: limit,
  });
};

const countExistingUsers = async (): Promise<number> => {
  return await prisma.user.count();
};

const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const getUserByPhone = async (phone: string) => {
  return await prisma.user.findFirst({
    where: { phone },
  });
};

const savePasswordResetToken = async (userId: string, token: string) => {
  return await prisma.passwordReset.create({
    data: {
      userId,
      token,
      expiresAt: new Date(Date.now() + 3600000), // Token expires in 1 hour
    },
  });
};

const verifyPasswordResetToken = async (userId: string, token: string) => {
  const record = await prisma.passwordReset.findFirst({
    where: {
      userId,
      token,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  return !!record;
};

const createUser = async (userData: CreateUserDTO) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (existingUser) {
    throw new CustomError("User already exists", STATUS_CODES.CONFLICT);
  }

  return await prisma.user.create({
    data: userData,
  });
};

const updateUser = async (id: string, userData: Partial<CreateUserDTO>) => {
  return await prisma.user.update({
    where: { id },
    data: userData,
  });
};

const deleteUser = async (id: string) => {
  const user = await getUserById(id);
  if (!user) {
    throw new Error("User not exists");
  }
  await prisma.$transaction(async (prisma) => {
    // Delete related password resets
    await prisma.passwordReset.deleteMany({
      where: { userId: id },
    });

    // Delete user
    await prisma.user.delete({
      where: { id },
    });
  });
  return;
};

export default {
  getAllUsers,
  countExistingUsers,
  getUserById,
  getUserByEmail,
  getUserByPhone,
  savePasswordResetToken,
  verifyPasswordResetToken,
  createUser,
  updateUser,
  deleteUser,
};
