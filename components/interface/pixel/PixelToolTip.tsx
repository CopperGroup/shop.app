import { PixelData, ReadOnly } from "@/lib/types/types";
import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, Clock, Info } from "lucide-react";
import { FaMeta } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
};
  
const getTimeDifference = (fromDate: string) => {
    const diff = Date.now() - new Date(fromDate).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
};

type PixelToolTipProps = {
    trigger: ReactNode;
    pixelInfo: {
        _id: string;
        name: string;
        id: string;
        type: "Meta" | "TikTok";
        status: "Active" | "Deactivated"
        createdAt: string;
        activatedAt?: string;
        deactivatedAt?: string;
    }
}

const PixelToolTip = (props: ReadOnly<PixelToolTipProps>) => {
  const isTikTok = props.pixelInfo.type === "TikTok";
  const bgColor = isTikTok ? "bg-[#FFF0F5]" : "bg-[#F0F6FF]";
  const textColor = isTikTok ? "text-[#FF004F]" : "text-[#0668E1]";
  const iconColor = isTikTok ? "text-[#FF004F]" : "text-[#0668E1]";

  return (
    <TooltipProvider key={props.pixelInfo._id}>
        <Tooltip>
        <TooltipTrigger asChild>
            {props.trigger}
        </TooltipTrigger>
        <TooltipContent 
            side="bottom" 
            align="center" 
            className="w-64 p-0 bg-white rounded-lg shadow-xl"
        >
            <div className={`p-3 ${bgColor} rounded-t-lg`}>
            <h3 className={`text-base-semibold ${textColor} mb-0.5`}>{props.pixelInfo.name}</h3>
            <p className="text-small-regular text-gray-600">ID: {props.pixelInfo.id}</p>
            </div>
            <div className="p-3 space-y-1.5">
            <div className="flex items-center">
                <Info className={`w-3.5 h-3.5 mr-1.5 ${iconColor}`} />
                <div className="flex gap-1 items-center text-small-regular">
                    <span>Type: </span>
                    {isTikTok ? (
                      <FaTiktok className={`${iconColor} ml-1`}/>
                    ) : (
                      <FaMeta className={`${iconColor} ml-1`}/>
                    )}
                    <span>{props.pixelInfo.type}</span>
                </div>
            </div>
            <div className="flex items-center">
                <Calendar className={`w-3.5 h-3.5 mr-1.5 ${iconColor}`} />
                <span className="text-small-regular">Created: {formatDate(props.pixelInfo.createdAt)}</span>
            </div>
            <div className="flex items-center">
                <Clock className={`w-3.5 h-3.5 mr-1.5 ${iconColor}`} />
                <span className="text-small-regular">
                {props.pixelInfo.status === "Active" 
                    ? `Active for: ${getTimeDifference(props.pixelInfo.activatedAt || props.pixelInfo.createdAt)}`
                    : `Deactivated: ${formatDate(props.pixelInfo.deactivatedAt || '')}`
                }
                </span>
            </div>
            <div className={`text-small-semibold ${props.pixelInfo.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                Status: {props.pixelInfo.status}
            </div>
            </div>
        </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}

export default PixelToolTip;