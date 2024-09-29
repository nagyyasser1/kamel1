import reportService from "../services/report.service";
import { Request, Response } from "express";

const createReport = async (req: Request, res: Response) => {
  const { type, description } = req.body;
  try {
    const report = await reportService.createReport(type, description);
    return res.status(201).json(report);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create report", error });
  }
};

const getReports = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;

    const reports = await reportService.getAllReports(type as any);
    return res.status(200).json(reports);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get reports", error });
  }
};

const getReportById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const report = await reportService.getReport(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    return res.status(200).json(report);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get report", error });
  }
};

const deleteReport = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await reportService.removeReport(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete report", error });
  }
};

const updateReport = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { type, description } = req.body;
  try {
    const report = await reportService.updateReport(id, type, description);
    return res.status(200).json(report);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update report", error });
  }
};

export default {
  createReport,
  getReports,
  getReportById,
  deleteReport,
  updateReport,
};
