import { PixelData } from "@/lib/types/types";
import { Calendar, Clock, Info } from "lucide-react"
import { FaMeta, FaTiktok } from "react-icons/fa6";

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
};
  
const getTimeDifference = (fromDate: string) => {
    const diff = Date.now() - new Date(fromDate).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / 1000 / 60);
    return `${days}d ${hours}h ${minutes}m`;
};

const PixelToolTipContent = ({ pixel }: { pixel: PixelData }) => {
  return (
    <>
        <div className="p-3 bg-[#F0F6FF] rounded-t-lg">
            <h3 className="text-base-semibold text-[#0668E1] mb-0.5">
                {pixel.name}
            </h3>
            <p className="text-small-regular text-gray-600">
                ID: {pixel.id}
            </p>
        </div>
        <div className="p-3 space-y-1.5">
          <div className="flex items-center">
            <Info className="w-3.5 h-3.5 mr-1.5 text-[#0668E1]" />
            <div className="flex gap-1 items-center text-small-regular">
              <span>Type: </span>
              {pixel.type == "Meta" ? <FaMeta className="text-[#0668E1] ml-1" /> : <FaTiktok className="text-black ml-1" /> }
              <span>{pixel.type}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#0668E1]" />
            <span className="text-small-regular">
              Created: {formatDate(pixel.createdAt)}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-[#0668E1]" />
            <span className="text-small-regular">
              {pixel.status === "Active"
                ? `Active for: ${getTimeDifference(pixel.activatedAt || pixel.createdAt)}`
                : `Deactivated: ${formatDate(pixel.deactivatedAt || "")}`}
            </span>
          </div>
          <div
            className={`text-small-semibold ${pixel.status === "Active" ? "text-green-600" : "text-red-600"}`}
          >
            Status: {pixel.status}
          </div>
        </div>
    </>
  )
}

export default PixelToolTipContent