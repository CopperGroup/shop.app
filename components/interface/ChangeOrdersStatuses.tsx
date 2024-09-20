"use client";

import { changePaymentStatus, changedeliveryStatus } from "@/lib/actions/order.actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { usePathname } from "next/navigation";

const ChangeOrdersStatuses = ({ id, paymentStatus, deliveryStatus }: { id: string, paymentStatus: string, deliveryStatus: string}) => {
  const pathname = usePathname();

  const handlePaymentStatusChange = async (id: string, value: string) => {
    await changePaymentStatus(id, value, pathname);
  }

  const handleDeliveryStatusChange = async (id: string, value: string) => {
    await changedeliveryStatus(id, value, pathname)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'Proceeding':
        return 'bg-gray-500';
      case 'Declined':
      case 'Canceled':
        return 'bg-red-500';
      case 'Success':
      case 'Fulfilled':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };


  return (
    <div className="flex gap-5 flex-col">
      <div className="flex items-center gap-2 max-[900px]:flex-col">
              <span className="text-start font-semibold max-[900px]:w-full">Статус оплати:</span>
              <Select defaultValue={paymentStatus} onValueChange={(value) => handlePaymentStatusChange(id, value)}>
                <SelectTrigger className="w-72 h-9 appearance-none text-start border-black rounded-none mt-2 pb-4 focus:ring-0 focus:border-b max-[1100px]:w-full border-0 ">
                  <SelectValue className="cursor-poiner flex gap-2"/>
                </SelectTrigger>
                <SelectContent className="cursor-poiner">
                  <SelectItem value="Pending" className="w-full cursor-poiner"><div className="w-full flex items-center gap-2"><div className="size-3 min-w-3 rounded-full bg-gray-500"></div><p>Оплата очікується</p></div></SelectItem>
                  <SelectItem value="Success" className="cursor-poiner"><div className="w-full flex items-center gap-2"><div className="size-3 min-w-3 rounded-full bg-green-500"></div><p>Оплату підтверджено</p></div></SelectItem>
                  <SelectItem value="Declined" className="cursor-poiner"><div className="w-full flex items-center gap-2"><div className="size-3 min-w-3 rounded-full bg-red-500"></div><p>Оплату відхилено</p></div></SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 max-[900px]:flex-col">
              <span className="text-start font-semibold max-[900px]:w-full">Статус доставки:</span>
              <Select defaultValue={deliveryStatus} onValueChange={(value) => handleDeliveryStatusChange(id, value)}>
                <SelectTrigger className="w-80 h-9 appearance-none text-start border-black rounded-none mt-2 pb-4 focus:ring-0 focus:border-b max-[1100px]:w-full border-0">
                  <SelectValue className="cursor-poiner flex gap-2"/>
                </SelectTrigger>
                <SelectContent className="cursor-poiner">
                  <SelectItem value="Proceeding" className="w-full cursor-poiner"><div className="w-full flex items-center gap-2"><div className="size-3 min-w-3 rounded-full bg-gray-500"></div><p>Замовлення опрацьовується</p></div></SelectItem>
                  <SelectItem value="Fulfilled" className="cursor-poiner"><div className="w-full flex items-center gap-2"><div className="size-3 min-w-3 rounded-full bg-green-500"></div><p>Замовлення доставлено</p></div></SelectItem>
                  <SelectItem value="Canceled" className="cursor-poiner"><div className="w-full flex items-center gap-2"><div className="size-3 min-w-3 rounded-full bg-red-500"></div><p>Замовлення скасовано</p></div></SelectItem>
                </SelectContent>
              </Select>
            </div>
    </div>
  )
}

export default ChangeOrdersStatuses;