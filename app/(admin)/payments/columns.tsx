"use client"

import * as React from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Order = {
  id: string;
  value: number;
  name: string;
  phoneNumber: string;
  email: string;
  paymentStatus: string;
  deliveryStatus: string;
  date: Date;
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "ID замовлення",
    cell: ({ row }) => <div className="pl-4">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div>{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone number",
    cell: ({ row }) => (
      <div>{row.getValue("phoneNumber")}</div>
    ),
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          До сплати
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="pl-5">{row.getValue("value")}</div>,
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => {
      return (
        <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Оплата
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className={`pl-5 font-medium ${row.getValue("paymentStatus") === "Success" ? "text-green-500" : row.getValue("paymentStatus") === "Declined" ? "text-red-500" : ""}`}>{row.getValue("paymentStatus")}</div>,
  },
  {
    accessorKey: "deliveryStatus",
    header: ({ column }) => {
      return (
        <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Доставка
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className={`pl-5 font-medium ${row.getValue("deliveryStatus") === "Fulfilled" ? "text-green-500" : row.getValue("deliveryStatus") === "Canceled" ? "text-red-500" : ""}`}>{row.getValue("deliveryStatus")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Замовник
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="pl-5">{row.getValue("name")}</div>,
  },
]
