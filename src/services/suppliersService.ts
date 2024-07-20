import prisma from "../prisma";

export const createSupplier = async (data: {
  name: string;
  email: string;
  phone: string;
  type: string;
}) => {
  return await prisma.supplier.create({
    data,
  });
};

export const updateSupplier = async (
  id: string,
  data: Partial<{
    name: string;
    email: string;
    phone: string;
    type: string;
  }>
) => {
  return await prisma.supplier.update({
    where: { id },
    data,
  });
};

export const deleteSupplier = async (id: string) => {
  return await prisma.supplier.delete({
    where: { id },
  });
};

export const getAllSuppliers = async () => {
  return await prisma.supplier.findMany();
};

export const getSupplierById = async (id: string) => {
  return await prisma.supplier.findUnique({
    where: { id },
  });
};
