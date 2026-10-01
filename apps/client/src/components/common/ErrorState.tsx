import { Link } from "react-router-dom";
import { useStackProvider } from "../../providers/StackProvider";

type Props = {
    title: string;
    description: string;
    fallbackUrl?: string;
    code?: string;
    fontSize: "large" | "small";
};

const ErrorState = ({
    title,
    description,
    fallbackUrl,
    code,
    fontSize,
}: Props) => {
    const {pop} = useStackProvider();

    return (
        <div className="flex flex-col items-center justify-center text-center">
            {
                code &&
                <div className="bg-linear-to-r from-neutral-800 to-neutral-50 bg-clip-text text-transparent text-[90px] font-bold">
                    {code ?? '?'}
                </div>
            }
            <div className="space-y-4">
                <h1 className={`${fontSize == "large" ? 'text-3xl' : 'text-2xl'} font-semibold text-neutral-100`}>
                    {title}
                </h1>

                <p className={`${fontSize == "large" ? 'text-lg' : 'text-sm'} font-light text-neutral-300`}>
                    {description}
                </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
                {
                    fallbackUrl ?
                        <Link
                            to={fallbackUrl ?? "/"}
                            className="cursor-pointer px-4 py-2 rounded-full bg-white border border-white hover:bg-transparent hover:text-white duration-100 text-black text-sm font-medium hover:opacity-90 transition"
                        >
                            Go back
                        </Link>
                        :
                        <button
                            onClick={pop}
                            className="cursor-pointer px-4 py-2 rounded-full bg-white border border-white hover:bg-transparent hover:text-white duration-100 text-black text-sm font-medium hover:opacity-90 transition"
                        >
                            Go back
                        </button>

                }

                <button
                    onClick={() => window.location.reload()}
                    className="cursor-pointer px-4 py-2 rounded-full border border-neutral-700 text-sm font-medium hover:bg-neutral-950 transition"
                >
                    Try again
                </button>
            </div>
        </div>
    );
};

export default ErrorState;