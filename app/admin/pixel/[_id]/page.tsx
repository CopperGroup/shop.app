import EventManagement from "@/components/admin-components/pixel/EventsManager";
import SetPixelStatusButton from "@/components/interface/pixel/SetPixelStatusButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchPixel } from "@/lib/actions/pixel.actions";
import { Calendar, Clock } from 'lucide-react';
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FaMeta, FaTiktok } from "react-icons/fa6";
import CryptoJS from "crypto-js";;

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getTimeDifference(fromDate: string) {
  const diff = Date.now() - new Date(fromDate).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${days}d ${hours}h ${minutes}m`
}

const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

const Page = async ({ params }: { params: { _id: string }}) => {
  const pixel = await fetchPixel({ _id: params._id})

  if (!pixel) {
    notFound()
  }

  const bytes = CryptoJS.AES.decrypt(pixel.id, encryptionKey as string);
  const decryptedPixelID = bytes.toString(CryptoJS.enc.Utf8);

  return (
    <section className="px-4 py-6 w-full max-w-6xl mx-auto"> 
      <Card className="w-full bg-gray-50 shadow-sm border border-gray-200">
        <CardHeader className="bg-gray-100 pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              {pixel.type === 'Meta' ? (
                <FaMeta className="h-6 w-6 text-[#0668E1]" />
              ) : (
                <FaTiktok className="h-6 w-6 text-[#FF004F]" />
              )}
              <div>
                <CardTitle className="text-heading4-medium text-gray-900">{pixel.name}</CardTitle>
                <CardDescription className="text-small-regular text-gray-700">ID: {decryptedPixelID}</CardDescription>
              </div>
            </div>
            <SetPixelStatusButton _id={pixel._id} status={pixel.status} type={pixel.type} className="text-xs px-2 py-1"/>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex items-center space-x-2 text-gray-700">
              <Calendar className="h-4 w-4" />
              <span className="text-small-regular">Created: {formatDate(pixel.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Clock className="h-4 w-4" />
              <span className="text-small-regular">
                {pixel.status === 'Active'
                  ? `Active for: ${getTimeDifference(pixel.activatedAt || pixel.createdAt)}`
                  : `Deactivated: ${formatDate(pixel.deactivatedAt || '')}`}
              </span>
            </div>
          </div>
          <Separator className="my-6 bg-gray-300" />
          <div>
            <h3 className="text-base-semibold text-gray-900 mb-4">Event Management</h3>
            <Suspense fallback={<div className="text-small-regular text-gray-600">Loading event management...</div>}>
              <EventManagement _id={pixel._id} initialEvents={pixel.events} />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default Page