import prisma from "../prisma";

export const createClient = async (data: {
  name: string;
  email: string;
  phone: string;
  type: string;
}) => {
  return await prisma.client.create({
    data,
  });
};

export const updateClient = async (
  id: string,
  data: Partial<{
    name: string;
    email: string;
    phone: string;
    type: string;
  }>
) => {
  return await prisma.client.update({
    where: { id },
    data,
  });
};

export const deleteClient = async (id: string) => {
  return await prisma.client.delete({
    where: { id },
  });
};

export const getAllClients = async () => {
  return await prisma.client.findMany();
};

export const getClientById = async (id: string) => {
  return await prisma.client.findUnique({
    where: { id },
  });
};

export const getClientByEmail = async (email: string) => {
  return await prisma.client.findFirst({
    where: { email },
  });
};

export const clientHaveAccount = async (id: string): Promise<boolean> => {
  const client = await prisma.account.findFirst({
    where: { clientId: id },
  });
  return client !== null;
};

export const clientExists = async (id: string): Promise<boolean> => {
  const client = await prisma.client.findUnique({
    where: { id },
  });
  return client !== null;
};
