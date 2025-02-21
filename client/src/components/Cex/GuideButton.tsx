import { ExternalLink } from "lucide-react";

interface GuideButtonProps {
    name: string;
    url: string;
    link: string;
}

export const GuideButton = ({ name, url, link }: GuideButtonProps) => (
    <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center px-[28px] py-3 bg-v2-background-dark text-white text-md font-medium rounded-lg"
    >
        <img className="w-18 h-18" src={url} alt={name} />
        <div className="text-gray-400 flex items-center text-sm mt-4">
            <span className="text-xs">Read Guide</span> <ExternalLink className="ml-1" size={"12px"} />
        </div>
    </a>
);

