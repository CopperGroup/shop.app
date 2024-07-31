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

  return (
    <div className="flex gap-5 max-[1100px]:flex-col max-[1100px]:gap-2">
      <Select defaultValue={paymentStatus} onValueChange={(value) => handlePaymentStatusChange(id, value)}>
        <SelectTrigger className="w-72 h-9 max-[1100px]:w-full">
          <SelectValue className="cursor-poiner flex gap-2"/>
        </SelectTrigger>
        <SelectContent className="cursor-poiner">
          <SelectItem value="Pending" className="w-full cursor-poiner"><div className="w-full flex items-center gap-2"><div className="size-3 rounded-full bg-gray-500"></div><p>Оплата очікується</p></div></SelectItem>
          <SelectItem value="Success" className="cursor-poiner"><div className="w-full flex items-center gap-2"><div className="size-3 rounded-full bg-green-500"></div><p>Оплату підтверджено</p></div></SelectItem>
          <SelectItem value="Declined" className="cursor-poiner"><div className="w-full flex items-center gap-2"><div className="size-3 rounded-full bg-red-500"></div><p>Оплату відхилено</p></div></SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue={deliveryStatus} onValueChange={(value) => handleDeliveryStatusChange(id, value)}>
        <SelectTrigger className="w-80 h-9 max-[1100px]:w-full">
          <SelectValue className="cursor-poiner flex gap-2"/>
        </SelectTrigger>
        <SelectContent className="cursor-poiner">
          <SelectItem value="Proceeding" className="w-full cursor-poiner"><div className="w-full flex items-center gap-2"><div className="size-3 rounded-full bg-gray-500"></div><p>Замовлення опрацьовується</p></div></SelectItem>
          <SelectItem value="Fulfilled" className="cursor-poiner"><div className="w-full flex items-center gap-2"><div className="size-3 rounded-full bg-green-500"></div><p>Замовлення доставлено</p></div></SelectItem>
          <SelectItem value="Canceled" className="cursor-poiner"><div className="w-full flex items-center gap-2"><div className="size-3 rounded-full bg-red-500"></div><p>Замовлення скасовано</p></div></SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default ChangeOrdersStatuses;