/**
 * Component Table tùy chỉnh
 * Cung cấp bảng dữ liệu với styling nhất quán
 */
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Component Table container
 * @param {Object} props - Props của component
 * @param {string} props.className - Class CSS bổ sung
 */
const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
))
Table.displayName = "Table"

/**
 * Component header của Table
 * @param {Object} props - Props của component
 * @param {string} props.className - Class CSS bổ sung
 */
const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

/**
 * Component body của Table
 * @param {Object} props - Props của component
 * @param {string} props.className - Class CSS bổ sung
 */
const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
))
TableBody.displayName = "TableBody"

/**
 * Component footer của Table
 * @param {Object} props - Props của component
 * @param {string} props.className - Class CSS bổ sung
 */
const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...props} />
))
TableFooter.displayName = "TableFooter"

/**
 * Component row của Table
 * @param {Object} props - Props của component
 * @param {string} props.className - Class CSS bổ sung
 */
const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)}
    {...props}
  />
))
TableRow.displayName = "TableRow"

/**
 * Component header cell của Table
 * @param {Object} props - Props của component
 * @param {string} props.className - Class CSS bổ sung
 */
const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

/**
 * Component cell của Table
 * @param {Object} props - Props của component
 * @param {string} props.className - Class CSS bổ sung
 */
const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
))
TableCell.displayName = "TableCell"

/**
 * Component caption của Table
 * @param {Object} props - Props của component
 * @param {string} props.className - Class CSS bổ sung
 */
const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
))
TableCaption.displayName = "TableCaption"

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
