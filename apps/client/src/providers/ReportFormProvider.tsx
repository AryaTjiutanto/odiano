import type { ReportReasonCode, ReportType } from "@odiano/shared";
import { createContext, useContext, useState } from "react";
import { createReport } from "../services/report.service";
import { notify } from "../helpers/notification/notify.helper";

type ReportFormContextType = {
    isOpen: boolean,
    close: () => void,
    open: (targetId : string | null, targetType : ReportType) => void,
    submit: (reasonCode : ReportReasonCode, fn? : () => void) => Promise<void>,
    isSubmitting: boolean,
}

const ReportFormContext = createContext<ReportFormContextType | null>(null);

const ReportFormProvider = ({ children }: any) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [targetId, setTargetId] = useState<string | null>(null);
    const [targetType, setTargetType] = useState<ReportType | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const open = (targetId : string | null, targetType : ReportType) => {
        setTargetId(targetId);
        setTargetType(targetType);
        setIsOpen(true);
    }

    const close = () => {
        setIsOpen(false);
    }

    const submit = async (reasonCode : ReportReasonCode, fn : () => void = () => {}) => {
        if(!targetId || !targetType) return;

        setIsSubmitting(true);

        try {
            await createReport(reasonCode, targetId, targetType);
            fn();
        } catch (err) {
            notify.error({title: "Something went wrong", description: "Please try again later"});
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <ReportFormContext.Provider value={{
            isOpen,
            close,
            open,
            submit,
            isSubmitting
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