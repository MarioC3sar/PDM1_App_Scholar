import api, { getApiErrorMessage } from "@/services/api";

export type DashboardStats = {
  approvedCount: number;
  concludedCount: number;
  totalGrades: number;
  approvalRate: number;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.get<DashboardStats>("/dashboard/stats");
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Falha ao carregar estatísticas do dashboard."),
    );
  }
};
