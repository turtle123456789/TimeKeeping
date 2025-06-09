/**
 * Component bảng nhân viên làm thêm giờ (OT)
 * Hiển thị danh sách nhân viên làm thêm giờ và thông tin chi tiết
 */
"use client"

import { useState, useEffect } from "react"
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

export function OvertimeEmployeesTable() {
  const { departments, employees } = useEmployees()
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [date, setDate] = useState(new Date())
  const [overtimeEmployees, setOvertimeEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalEmployees, setTotalEmployees] = useState(0)
  const [totalCheckins, setTotalCheckins] = useState(0)
  const [overtimeCount, setOvertimeCount] = useState(0)

  // Format ngày thành YYYY-MM-DD
  const formatDate = (date) => {
    return format(date, 'yyyy-MM-dd')
  }

  // Fetch dữ liệu nhân viên làm thêm giờ
  const fetchOvertimeEmployees = async (selectedDate, departmentId) => {
    try {
      setIsLoading(true)
      const formattedDate = formatDate(selectedDate)
      const url = `http://localhost:3001/api/employees/overtime?date=${formattedDate}&departmentId=${departmentId}`
      
      const response = await fetch(url)
      const result = await response.json()

      if (result.status === 200 && result.data) {
        setOvertimeEmployees(result.data.employees || [])
        setTotalEmployees(result.data.totalEmployees || 0)
        setTotalCheckins(result.data.totalCheckins || 0)
        setOvertimeCount(result.data.overtimeEmployees || 0)
      }
    } catch (error) {
      console.error('Error fetching overtime employees:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch dữ liệu khi component mount hoặc khi date/department thay đổi
  useEffect(() => {
    fetchOvertimeEmployees(date, departmentFilter)
  }, [date, departmentFilter])

  // Lọc nhân viên làm thêm giờ theo tìm kiếm
  const filteredOvertimeEmployees = overtimeEmployees.filter((emp) => {
    if (!emp || typeof emp !== 'object') return false

    const searchTermLower = String(searchTerm).toLowerCase()
    const nameLower = String(emp.employeeName || '').toLowerCase()
    const idStr = String(emp.Id || '')
    
    return nameLower.includes(searchTermLower) || idStr.includes(searchTermLower)
  })

  // Chuẩn bị dữ liệu để xuất Excel
  const prepareExcelData = () => {
    return filteredOvertimeEmployees.map((emp) => {
      if (!emp || typeof emp !== 'object') return null
      
      return {
        ID: String(emp.employeeId || ''),
        "Họ Tên": String(emp.employeeName || ''),
        "Bộ Phận": String(emp.department || ''),
        "Vị Trí": String(emp.position || ''),
        "Giờ Check-out": String(emp.checkinTime || ''),
        "Làm Thêm Giờ": String(emp.overtimeMinutes || ''),
        "Số Lần Làm Thêm Giờ Trong Tháng": Number(emp.countOvertime) || 0,
      }
    }).filter(Boolean)
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
                <SelectItem key={String(dept._id)} value={String(dept._id)}>
                  {String(dept.name)}
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

      {/* Bảng nhân viên làm thêm giờ */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Danh Sách Nhân Viên Làm Thêm Giờ - {format(date, "PPP", { locale: vi })}</CardTitle>
          <ExportExcelButton
            data={prepareExcelData()}
            filename={`Nhan-Vien-OT-${formattedDate}`}
            sheetName="Làm Thêm Giờ"
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
                  <TableHead>Giờ Check-out</TableHead>
                  <TableHead>Làm Thêm Giờ</TableHead>
                  <TableHead>Số Lần Làm Thêm Giờ Trong Tháng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : !filteredOvertimeEmployees || filteredOvertimeEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      Không có nhân viên nào làm thêm giờ
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOvertimeEmployees.map((emp) => {
                    if (!emp || typeof emp !== 'object') return null
                    
                    return (
                      <TableRow key={String(emp.Id)}>
                        <TableCell>{String(emp.Id || '')}</TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg" alt={String(emp.employeeName || '')} />
                              <AvatarFallback>
                                {emp.employeeName ? String(emp.employeeName).substring(0, 2).toUpperCase() : "NV"}
                              </AvatarFallback>
                            </Avatar>
                            {String(emp.employeeName || '')}
                          </div>
                        </TableCell>
                        <TableCell>{String(emp.department || '')}</TableCell>
                        <TableCell>{String(emp.position || '')}</TableCell>
                        <TableCell>{String(emp.checkinTime || '')}</TableCell>
                        <TableCell>
                          <Badge className="bg-purple-500">{String(emp.overtimeMinutes || '')}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                            {String(emp.countOvertime || 0)} lần
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
