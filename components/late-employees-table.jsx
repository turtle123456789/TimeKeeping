/**
 * Component bảng nhân viên đi muộn
 * Hiển thị danh sách nhân viên đi muộn và thông tin chi tiết
 */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useEmployees } from "@/hooks/use-employees"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { ExportExcelButton } from "@/components/export-excel-button"

export function LateEmployeesTable() {
  const { employees } = useEmployees()
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [date, setDate] = useState(new Date())

  // Lấy danh sách phòng ban duy nhất từ dữ liệu nhân viên
  const departments = [...new Set(employees.map((emp) => emp.department).filter(Boolean))]

  // Tạo dữ liệu nhân viên đi muộn cho ngày được chọn
  const generateLateEmployees = () => {
    return employees
      .filter((emp) => emp.attendanceStatus === "late")
      .map((emp) => {
        // Tạo số phút đi muộn ngẫu nhiên từ 5 đến 60 phút
        const lateMinutes = Math.floor(Math.random() * 56) + 5

        // Tạo số lần đi muộn trong tháng ngẫu nhiên từ 1 đến 5
        const lateCountInMonth = Math.floor(Math.random() * 5) + 1

        return {
          id: emp.id,
          name: emp.name || "Nhân viên mới",
          department: emp.department || "-",
          position: emp.position || "-",
          image: emp.image || "/placeholder.svg?height=80&width=80",
          lateMinutes,
          lateCountInMonth,
          checkIn: emp.checkIn || "-",
          checkOut: emp.checkOut || "-",
        }
      })
  }

  const lateEmployees = generateLateEmployees()

  // Lọc nhân viên đi muộn theo tìm kiếm và phòng ban
  const filteredLateEmployees = lateEmployees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.id.toString().includes(searchTerm)
    const matchesDepartment = departmentFilter === "all" || emp.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  // Format số phút thành chuỗi "X giờ Y phút"
  const formatMinutes = (minutes) => {
    if (minutes < 60) {
      return `${minutes} phút`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (remainingMinutes === 0) {
      return `${hours} giờ`
    }

    return `${hours} giờ ${remainingMinutes} phút`
  }

  // Chuẩn bị dữ liệu để xuất Excel
  const prepareExcelData = () => {
    return filteredLateEmployees.map((emp) => ({
      ID: emp.id,
      "Họ Tên": emp.name,
      "Bộ Phận": emp.department,
      "Vị Trí": emp.position,
      "Giờ Check-in": emp.checkIn,
      "Đi Muộn": formatMinutes(emp.lateMinutes),
      "Số Phút Đi Muộn": emp.lateMinutes,
      "Số Lần Đi Muộn Trong Tháng": emp.lateCountInMonth,
    }))
  }

  // Format ngày hiện tại
  const formattedDate = format(date, "dd-MM-yyyy", { locale: vi })

  return (
    <div className="space-y-4">
      {/* Phần bộ lọc */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Ô tìm kiếm */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm nhân viên theo tên hoặc ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        {/* Bộ lọc phòng ban */}
        <div className="w-full md:w-48">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tất Cả Phòng Ban" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất Cả Phòng Ban</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Bộ chọn ngày */}
        <div className="w-full md:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="w-full justify-start text-left font-normal md:w-[240px]">
                <Calendar className="mr-2 h-4 w-4" />
                {format(date, "PPP", { locale: vi })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
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

      {/* Bảng nhân viên đi muộn */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Danh Sách Nhân Viên Đi Muộn - {format(date, "PPP", { locale: vi })}</CardTitle>
          <ExportExcelButton
            data={prepareExcelData()}
            filename={`Nhan-Vien-Di-Muon-${formattedDate}`}
            sheetName="Đi Muộn"
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nhân Viên</TableHead>
                  <TableHead>Bộ Phận</TableHead>
                  <TableHead>Vị Trí</TableHead>
                  <TableHead>Giờ Check-in</TableHead>
                  <TableHead>Đi Muộn</TableHead>
                  <TableHead>Số Lần Đi Muộn Trong Tháng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLateEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      Không có nhân viên nào đi muộn
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLateEmployees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>{emp.id}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={emp.image || "/placeholder.svg"} alt={emp.name} />
                            <AvatarFallback>{emp.name ? emp.name.substring(0, 2).toUpperCase() : "NV"}</AvatarFallback>
                          </Avatar>
                          {emp.name}
                        </div>
                      </TableCell>
                      <TableCell>{emp.department}</TableCell>
                      <TableCell>{emp.position}</TableCell>
                      <TableCell>{emp.checkIn}</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-500">{formatMinutes(emp.lateMinutes)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          {emp.lateCountInMonth} lần
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
