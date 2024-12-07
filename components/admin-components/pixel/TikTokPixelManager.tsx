import { AlertCircle, Plus, Trash2, X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CreateTikTokPixel } from "@/components/forms/CreateTikTokPixel"
import { FaTiktok } from "react-icons/fa6"
import { fetchPixels } from "@/lib/actions/pixel.actions"
import { DeletePixelButton } from "@/components/interface/pixel/DeletePixelButton"
import { PixelData } from "@/lib/types/types"
import CryptoJS from "crypto-js";

const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

export default async function TikTokPixelManager() {
    const pixels: PixelData[] = await fetchPixels("TikTok")

    pixels.forEach((pixel) => {
      const bytes = CryptoJS.AES.decrypt(pixel.id, encryptionKey as string);
      const decryptedPixelID = bytes.toString(CryptoJS.enc.Utf8);
  
      pixel.id = decryptedPixelID
    })
    return (
        <Card className="w-full min-w-[280px] h-fit shadow-lg border-0 overflow-hidden transition-all duration-300 hover:shadow-xl bg-black text-white">
          <CardHeader className="pb-2 bg-gray-900">
            <div className="flex items-center space-x-2">
                <FaTiktok className="size-6 sm:size-8 bg-black rounded-full p-1"/>
                <div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-white">
                    TikTok Pixels
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm md:text-base text-gray-400">
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
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF004F]" />
                <AlertTitle className="text-sm sm:text-base font-semibold">No pixels connected</AlertTitle>
                <AlertDescription className="text-xs sm:text-sm text-gray-300">
                  Add your first TikTok pixel to start tracking.
                </AlertDescription>
              </Alert>
            ) : (
              <ScrollArea className="h-[200px] w-full rounded-md border border-gray-700 p-2 mb-4">
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[400px]">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-2 text-xs sm:text-sm font-semibold text-gray-400">Pixel Name</th>
                        <th className="text-left p-2 text-xs sm:text-sm font-semibold text-gray-400">Pixel ID</th>
                        <th className="text-right p-2 text-xs sm:text-sm font-semibold text-gray-400">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pixels.map((pixel, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-700 last:border-b-0 transition-colors hover:bg-gray-800"
                        >
                          <td className="h-10 sm:h-12 p-2 flex items-center text-xs sm:text-sm">
                            <FaTiktok />
                            <span className="ml-2">{pixel.name}</span>
                          </td>
                          <td className="p-2 text-xs sm:text-sm">{pixel.id}</td>
                          <td className="p-2 text-right">
                              <DeletePixelButton  _id={pixel._id} type="TikTok"/>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
            )}
            <CreateTikTokPixel />
          </CardContent>
        </Card>
    )
}