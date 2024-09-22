import reportModel from "../models/report.model";

const createReport = async (type: string, description: string) => {
  return await reportModel.createReport({ type, description });
};

const getAllReports = async () => {
  return await reportModel.getReports();
};

const getReport = async (id: string) => {
  return await reportModel.getReportById(id);
};

const removeReport = async (id: string) => {
  return await reportModel.deleteReport(id);
};

const updateReport = async (
  id: string,
  type?: string,
  description?: string
) => {
  return await reportModel.updateReport(id, { type, description });
};

export default {
  createReport,
  getAllReports,
  getReport,
  removeReport,
  updateReport,
};
