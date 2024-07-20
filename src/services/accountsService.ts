import prisma from "../prisma";

interface CreateAccountData {
  type: string;
  ownerId: string;
}

interface UpdateAccountData {
  type?: string;
  ownerId?: string;
}

export const createAccount = async (data: CreateAccountData) => {
  let accountData: any = {
    type: data.type,
  };

  switch (data.type) {
    case "ASSET":
      accountData.asset = { connect: { id: data.ownerId } };
      break;
    case "CLIENT":
      accountData.client = { connect: { id: data.ownerId } };
      break;
    case "SUPPLIER":
      accountData.supplier = { connect: { id: data.ownerId } };
      break;
    default:
      throw new Error("Invalid account type");
  }

  return await prisma.account.create({
    data: accountData,
  });
};

export const updateAccount = async (id: string, data: UpdateAccountData) => {
  let accountData: any = {};

  if (data.type) {
    accountData.type = data.type;
  }

  if (data.ownerId) {
    switch (data.type) {
      case "ASSET":
        accountData.asset = { connect: { id: data.ownerId } };
        break;
      case "CLIENT":
        accountData.client = { connect: { id: data.ownerId } };
        break;
      case "SUPPLIER":
        accountData.supplier = { connect: { id: data.ownerId } };
        break;
      default:
        throw new Error("Invalid account type");
    }
  }

  return await prisma.account.update({
    where: { id },
    data: accountData,
  });
};

export const deleteAccount = async (id: string) => {
  return await prisma.account.delete({
    where: { id },
  });
};

export const getAllAccounts = async () => {
  return await prisma.account.findMany();
};

export const getAccountById = async (id: string) => {
  return await prisma.account.findUnique({
    where: { id },
    include: {
      asset: true,
      client: true,
      supplier: true,
    },
  });
};
