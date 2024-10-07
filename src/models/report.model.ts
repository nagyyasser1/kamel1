import prisma from "../prisma/index";

const createReport = async (data: {
  type: string;
  description: string;
  name: string;
}) => {
  return await prisma.report.create({
    data,
  });
};

const getReports = async (type: string) => {
  let where: any = {};

  if (type) {
    where.type = type;
  }
  return await prisma.report.findMany({ where });
};

const getReportById = async (id: string) => {
  return await prisma.report.findUnique({
    where: { id },
  });
};

const deleteReport = async (id: string) => {
  return await prisma.report.delete({
    where: { id },
  });
};

const updateReport = async (
  id: string,
  data: { type?: string; description?: string; name?: string }
) => {
  return await prisma.report.update({
    where: { id },
    data,
  });
};

export default {
  createReport,
  getReports,
  getReportById,
  deleteReport,
  updateReport,
};
