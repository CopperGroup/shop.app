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
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { proceedDataToDB } from "@/lib/proceedDataToDB"
import Image from "next/image"

export type Product = {
  _id: string
  id: string | null,
  name: string | null,
  isAvailable: boolean,
  quantity: number,
  url: string | null,
  priceToShow: number,
  price: number,
  images: (string | null)[],
  vendor: string | null,
  description: string | null,
  params: {
    name: string | null,
    value: string | null
  }[],
  isFetched: boolean,
  category: string // Add the category property here
}

export type DataTableProps<TData extends Product, TValue> = {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  // ... other props
}

export function DataTable<TData extends Product, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [proceedingState, setProceedingState] = React.useState("Зберегти");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  let isProceedDisabled = true;

  if(table.getIsAllRowsSelected()){
    isProceedDisabled = false;
  } else if(table.getIsSomeRowsSelected()){
    isProceedDisabled = false;
  } else {
    isProceedDisabled = true;
  }

  const handleProceed = async (data: Product[]) => {
    setProceedingState("Збереження");
  
    try {
      const allSelectedRowsIds = table.getSelectedRowModel().rows.map(row => row.original.id);
  
      await proceedDataToDB(data, allSelectedRowsIds);
    } finally {
      setProceedingState("Збережено");
  
      setTimeout(() => {
        setProceedingState("Зберегти")
      }, 2000)
    }
  }

  



  return (
    <div className="w-full max-md:pb-12">
      <div className="flex gap-2 items-center py-4">
        <Input
          placeholder="Назва товару..."
          value={(table.getColumn("name")?.getFilterValue() as string | undefined) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Стовпці <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.columnDef.header?.toString().replace(/[^А-ЩЬ-ЯҐЄІЇа-щь-яґєії\s]/g, '')} 
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-slate-50 transition-all"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Данні не знайдено.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 max-[560px]:flex-col max-[560px]:items-start max-[560px]:gap-2 max-[560px]:space-x-0">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} з{" "}
          {table.getFilteredRowModel().rows.length} товарів вибрано
        </div>
        <div className="space-x-2 max-[440px]:w-full max-[440px]:flex max-[440px]:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="max-[440px]:w-full"
          >
            Попередня
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="max-[440px]:w-full"
          >
            Наступна
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => handleProceed(data)}
            disabled={isProceedDisabled}
            className="bg-green-500 hover:bg-green-400 max-[440px]:hidden"

          >
            {proceedingState}
            {proceedingState === "Збереження" ? <Image height={24} width={24} src="/assets/spinner.svg" alt="Loading"/> : proceedingState === "Збережено" ? <Image height={24} width={24} src="/assets/success.svg" alt="Loading" className="ml-1"/> : <Image height={24} width={24} src="/assets/arrow-right-circle.svg" alt="Loading" className="ml-1"/>}
          </Button>
        </div>
        <div className="w-full flex justify-end min-[441px]:hidden">
          <Button
            variant="default"
            size="sm"
            onClick={() => handleProceed(data)}
            disabled={isProceedDisabled}
            className="w-full bg-green-500 hover:bg-green-400"
          >
              {proceedingState}
              {proceedingState === "Збереження" ? <Image height={24} width={24} src="/assets/spinner.svg" alt="Loading"/> : proceedingState === "Збережено" ? <Image height={24} width={24} src="/assets/success.svg" alt="Loading" className="ml-1"/> : <Image height={24} width={24} src="/assets/arrow-right-circle.svg" alt="Loading" className="ml-1"/>}
          </Button>
        </div>
      </div>
    </div>
  )
}

