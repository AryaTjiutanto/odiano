import type { ReportReasonCode, ReportType } from "@odiano/shared";
import { createContext, useContext, useState } from "react";
import { createReport } from "../services/report.service";

type ReportFormContextType = {
    isOpen: boolean,
    close: () => void,
    open: (targetId : string | null, targetType : ReportType) => void,
    submit: (reasonCode : ReportReasonCode) => Promise<void>,
}

const ReportFormContext = createContext<ReportFormContextType | null>(null);

const ReportFormProvider = ({ children }: any) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [targetId, setTargetId] = useState<string | null>(null);
    const [targetType, setTargetType] = useState<ReportType | null>(null);

    const open = (targetId : string | null, targetType : ReportType) => {
        setTargetId(targetId);
        setTargetType(targetType);
        setIsOpen(true);
    }

    const close = () => {
        setIsOpen(false);
    }

    const submit = async (reasonCode : ReportReasonCode) => {
        if(!targetId || !targetType) return;

        await createReport(reasonCode, targetId, targetType);
    }

    return (
        <ReportFormContext.Provider value={{
            isOpen,
            close,
            open,
            submit,
        }}>
            {children}
        </ReportFormContext.Provider>
    )
}

export default ReportFormProvider;

export const useReportForm = () => {
    const context = useContext(ReportFormContext);

    if (!context) {
        throw new Error("useReportForm must be used within a ReportFormProvider");
    }

    return context;
}