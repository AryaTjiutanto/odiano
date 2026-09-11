import { REPORT_REASONS, REPORT_TYPE, type ReportReasonCode } from "@odiano/shared";
import { ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { useReportForm } from "../../providers/ReportFormProvider";
import DotsLoader from "../loader/DotsLoader";

type ReportReason = {
    code: ReportReasonCode,
    description: string,
}

const ReportForm = () => {
    const reportForm = useReportForm();
    const [step, setStep] = useState<number>(1);
    const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);

    function selectReason(ReportReason: ReportReason) {
        setSelectedReason(ReportReason);
        setStep(2);
    }

    async function handleSubmit() {
        if (!selectedReason) return;

        await reportForm.submit(selectedReason.code, () => setStep(3));
    }

    return (
        <section className="w-full h-full fixed top-0 left-0 z-25 flex items-center justify-center">
            <form className="w-[550px] rounded-2xl bg-neutral-950 overflow-hidden z-26">
                <div className="w-full">
                    {/* header */}
                    <div className="px-6">
                        <div className={`py-6 flex items-center space-x-6 border-b border-neutral-800`}>
                            {
                                step < 3 ?
                                    <>
                                        <button className="relative group cursor-pointer" onClick={reportForm.close}>
                                            <div className="w-10 h-10 rounded-full absolute top-0 bottom-0 my-auto -left-1/2 m-auto bg-neutral-800/50 z-1 opacity-0 group-hover:opacity-100 duration-100"></div>
                                            <X className="w-5 text-neutral-300 group-hover:text-white z-1 relative" />
                                        </button>
                                        <h1 className="text-lg font-semibold text-neutral-300">
                                            Report
                                        </h1>
                                    </>
                                    :
                                    <h1 className="text-lg font-bold text-neutral-300">
                                        Submitted
                                    </h1>
                            }
                        </div>
                    </div>

                    {/* step 1 */}
                    {
                        step == 1 &&
                        <div className="overflow-y-auto py-4 px-2">
                            <h1 className="font-bold text-neutral-300 px-4">
                                Why are you reporting this post?
                            </h1>
                            <div className="mt-4 w-full max-h-[40vh] overflow-auto px-4">
                                {
                                    reportForm.targetType && REPORT_REASONS[reportForm.targetType].map((reason) => {
                                        return (
                                            <button key={`reason-${reason.code}`} className="flex items-center w-full justify-between py-3 text-neutral-400 cursor-pointer hover:text-neutral-300 group" onClick={() => selectReason(reason)}>
                                                <span>
                                                    {reason.description}
                                                </span>
                                                <div className="pr-2 group-hover:pr-1 duration-100">
                                                    <ChevronRight className="w-4" />
                                                </div>
                                            </button>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }

                    {/* step 2 */}
                    {
                        step == 2 &&
                        <div className="w-full">
                            {/* step 2 */}
                            {
                                step === 2 &&
                                <div className="w-full px-6 py-6 pb-8">
                                    <div className="">
                                        <h2 className="text-2xl font-bold text-neutral-200">
                                            Confirm your report
                                        </h2>

                                        <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                                            You're about to report this post for:
                                        </p>

                                        <div className="mt-4 rounded-lg bg-neutral-900 px-4 py-3 text-left">
                                            <p className="text-base font-medium text-neutral-200">
                                                {selectedReason?.description}
                                            </p>
                                        </div>

                                        <p className="mt-4 text-sm text-neutral-400 leading-relaxed">
                                            Please make sure this report is accurate. Reports help us
                                            keep the community safe and follow our guidelines.
                                        </p>
                                    </div>

                                    <div className="mt-16 space-y-3 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="w-full rounded-lg h-11 text-sm font-medium border border-neutral-700 hover:bg-neutral-900 duration-100 text-neutral-300 cursor-pointer"
                                        >
                                            Go back
                                        </button>

                                        <button
                                            type="button"
                                            className="w-full rounded-lg h-11 text-sm font-medium text-neutral-900 bg-neutral-300 hover:bg-neutral-100 cursor-pointer flex items-center justify-center" onClick={handleSubmit} disabled={reportForm.isSubmitting}
                                        >
                                            {
                                                reportForm.isSubmitting ?
                                                    <DotsLoader />
                                                    :
                                                    "Submit report"
                                            }
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                    }

                    {/* step 3 - submitted */}
                    {
                        step == 3 &&
                        <div className="px-6 w-full h-full py-5 text-neutral-300">
                            <h1 className="text-2xl font-bold">
                                Thanks for your feedback
                            </h1>
                            <p className="text-[15px] text-neutral-400 mt-1">
                                We appreciate you taking the time to report this. Your feedback helps us keep the community safe and welcoming for everyone.
                            </p>


                            <h2 className="text-lg font-bold mt-5">
                                What’s next?
                            </h2>
                            <p className="text-[15px] text-neutral-400 mt-1">
                                Our team will review your report and take appropriate action if we find a violation of our guidelines. We’ll notify you when the review is complete and let you know if any action was taken.
                            </p>

                            <button className="w-full rounded-lg h-11 text-sm font-medium text-neutral-900 bg-neutral-100 hover:bg-neutral-300 cursor-pointer mt-7" onClick={reportForm.close}>
                                Done
                            </button>
                        </div>
                    }
                </div>
            </form>

            <div className="w-full h-full absolute top-0 left-0 z-25 bg-black/50" onClick={reportForm.close}></div>
        </section>
    )
}

export default ReportForm;