import { AcademicContext } from "@/contexts/app-data-context";
import { AcademicContextType } from "@/types";
import { useContext } from "react";

export const useAcademicData = (): AcademicContextType => {
  const context = useContext(AcademicContext);

  if (!context) {
    throw new Error("useAcademicData deve ser usado dentro de AcademicProvider.");
  }

  return context;
};
