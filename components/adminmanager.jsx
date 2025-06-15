"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, CalendarIcon, Pencil, Eye, UserPlus } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { ExportExcelButton } from "@/components/export-excel-button"
import { EditAdminModal } from "@/components/edit-admin-modal"

import { format } from "date-fns"
import { vi } from "date-fns/locale"

export function AdminManagementTable() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [date, setDate] = useState(new Date())
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedAdminId, setSelectedAdminId] = useState(null)

  useEffect(() => {
    const formattedDate = format(date, "yyyy-MM-dd")
  }, [date])


  const openEditModal = (adminId) => {
    setSelectedAdminId(adminId)
    setEditModalOpen(true)
  }

  const prepareExcelData = () => {
    return {
        "Mã Quản Trị Viên": "",
        "Họ Tên":  "-",
        "Email":  "-",
        "Vai Trò":  "-",
        "Thời Gian Đăng Ký":  "-",
      }
  }

  const formattedDate = format(date, "dd-MM-yyyy", { locale: vi })

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm quản trị viên theo tên hoặc ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tất Cả Vai Trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất Cả Vai Trò</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="w-full justify-start text-left font-normal md:w-[240px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP", { locale: vi })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                locale={vi}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Danh Sách Quản Trị Viên</CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/dashboard/admins/new")}>
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm Quản Trị Viên
            </Button>
            <ExportExcelButton
              data={prepareExcelData()}
              filename={`Danh-Sach-Admin-${formattedDate}`}
              sheetName="Admin"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Họ Tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai Trò</TableHead>
                  <TableHead>Ảnh Đại Diện</TableHead>
                  <TableHead>Thời Gian Đăng Ký</TableHead>
                  <TableHead>Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>{"-"}</TableCell>
                    <TableCell>{"-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{"-"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={"/placeholder.svg"} alt="Avatar" />
                        <AvatarFallback>
                          {"s"}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{"-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/admins/edit`)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/admins`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Chi tiết
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal chỉnh sửa quản trị viên */}
      <EditAdminModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        adminId={selectedAdminId}
      />
    </div>
  )
}
