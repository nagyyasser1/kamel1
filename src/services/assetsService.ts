import prisma from "../prisma";

export const createAsset = async (data: {
  name: string;
  description: string;
  code: number;
}) => {
  return await prisma.asset.create({
    data,
  });
};

export const updateAsset = async (
  id: string,
  data: Partial<{
    name: string;
    description: string;
    code: number;
  }>
) => {
  return await prisma.asset.update({
    where: { id },
    data,
  });
};

export const deleteAsset = async (id: string) => {
  return await prisma.asset.delete({
    where: { id },
  });
};

export const getAllAssets = async () => {
  return await prisma.asset.findMany();
};

export const getAssetById = async (id: string) => {
  return await prisma.asset.findUnique({
    where: { id },
  });
};
