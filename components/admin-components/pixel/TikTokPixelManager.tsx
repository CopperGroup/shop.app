import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CreateTikTokPixel } from "@/components/forms/CreateTikTokPixel";
import { FaTiktok } from "react-icons/fa6";
import { fetchPixels } from "@/lib/actions/pixel.actions";
import { DeletePixelButton } from "@/components/interface/pixel/DeletePixelButton";
import { PixelData } from "@/lib/types/types";
import CryptoJS from "crypto-js";
import { AlertCircle, Calendar, Clock, Info } from "lucide-react";
import SetPixelStatusButton from "@/components/interface/pixel/SetPixelStatusButton";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

export default async function TikTokPixelManager() {
  const pixels: PixelData[] = await fetchPixels("TikTok");

  pixels.forEach((pixel) => {
    const bytes = CryptoJS.AES.decrypt(pixel.id, encryptionKey as string);
    const decryptedPixelID = bytes.toString(CryptoJS.enc.Utf8);
    pixel.id = decryptedPixelID;
  });

  return (
    <Card className="w-full min-w-[280px] h-fit shadow-lg border-0 overflow-hidden transition-all duration-300 hover:shadow-xl bg-black text-white">
      <CardHeader className="pb-2 bg-gray-900">
        <div className="flex items-center space-x-2">
          <FaTiktok className="size-8 bg-black rounded-full p-1" />
          <div>
            <CardTitle className="text-heading4-medium text-white">
              TikTok Pixels
            </CardTitle>
            <CardDescription className="text-small-regular text-gray-400">
              Manage your tracking pixels
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <Separator className="mb-4 bg-gray-700" />
      <CardContent>
        {pixels.length === 0 ? (
          <Alert
            variant="default"
            className="mb-4 bg-gray-800 border-[#FF004F] text-white"
          >
            <AlertCircle className="h-5 w-5 text-[#FF004F]" />
            <AlertTitle className="text-base-semibold">No pixels connected</AlertTitle>
            <AlertDescription className="text-base-regular text-gray-300">
              Add your first TikTok pixel to start tracking.
            </AlertDescription>
          </Alert>
        ) : (
          <ScrollArea className="h-[200px] w-full rounded-md border border-gray-700 p-2 mb-4">
            <div className="w-full overflow-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-2 text-small-semibold text-gray-400">Pixel Name</th>
                    <th className="text-left p-2 text-small-semibold text-gray-400">Pixel ID</th>
                    <th className="p-2 text-small-semibold text-gray-400">Status</th>
                    <th className="p-2 text-small-semibold text-gray-400">View</th>
                    <th className="text-right p-2 text-small-semibold text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pixels.map((pixel, index) => (
                    <TooltipProvider key={pixel._id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <tr
                            key={index}
                            className="border-b border-gray-700 last:border-b-0 transition-colors hover:bg-gray-800"
                          >
                            <td className="h-12 p-2 flex items-center text-small-regular">
                              <FaTiktok />
                              <span className="ml-2">{pixel.name}</span>
                            </td>
                            <td className="text-small-regular p-2">{pixel.id}</td>
                            <td className="text-right flex justify-center">
                              <SetPixelStatusButton
                                _id={pixel._id}
                                status={pixel.status}
                                type={pixel.type}
                              />
                            </td>
                            <td className="text-center">
                              <Link href={`/admin/pixel/${pixel._id}`}>
                                <Button className="h-6 text-[13px] border border-black rounded-lg p-1 px-2.5">
                                  View
                                </Button>
                              </Link>
                            </td>
                            <td className="p-2 text-right">
                              <DeletePixelButton _id={pixel._id} type="TikTok" />
                            </td>
                          </tr>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          align="center"
                          className="w-64 p-0 bg-white rounded-lg shadow-xl"
                        >
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
                                <FaTiktok className="text-[#0668E1] ml-1" />
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
                                  ? `Active for: ${getTimeDifference(
                                      pixel.activatedAt || pixel.createdAt
                                    )}`
                                  : `Deactivated: ${formatDate(pixel.deactivatedAt || "")}`}
                              </span>
                            </div>
                            <div
                              className={`text-small-semibold ${
                                pixel.status === "Active"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              Status: {pixel.status}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        )}
        <CreateTikTokPixel />
      </CardContent>
    </Card>
  );
}
