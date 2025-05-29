/**
 * Component bảng check-in gần đây
 * Hiển thị thông tin check-in gần đây của nhân viên
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
import { Search } from "lucide-react"
import socket from "@/lib/socket"
import { da } from "date-fns/locale"
export function RealtimeCheckinTable() {
  const { employees } = useEmployees()
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [recentCheckins, setRecentCheckins] = useState([])

  // Lấy danh sách phòng ban duy nhất từ dữ liệu nhân viên
  const departments = [...new Set(employees.map((emp) => emp.department).filter(Boolean))]

  // Giả lập dữ liệu check-in gần đây
  useEffect(() => {
    console.log("RealtimeCheckinTable mounted - Setting up socket listener")

    const handleCheckin = (data) => {
      console.log("Received checkin event in RealtimeCheckinTable:", data)
      
      // Đảm bảo checkinTime là một đối tượng Date hợp lệ
      let checkinTime;
      if (data.checkinTime) {
        console.log("Parsed exist:", checkinTime);
        checkinTime = new Date(data.checkinTime);
      } else if (data.timestamp) {
        checkinTime = new Date(data.timestamp);
      } else {
        checkinTime = new Date();
      }

      console.log("Parsed checkinTime:", checkinTime);

      const newCheckin = {
        id: data.employeeId,
        name: data.fullName || "Nhân viên mới",
        department: data.department || "-",
        position: data.position || "-",
        faceImage: data.faceImage || "/placeholder.svg",
        checkinTime: checkinTime,
        formattedTime: `${checkinTime.getHours().toString().padStart(2, "0")}:${checkinTime
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
      }

      console.log("Adding new checkin:", newCheckin)
      setRecentCheckins((prev) => [newCheckin, ...prev.slice(0, 19)])
    }

    // Lắng nghe sự kiện "checkin"
    socket.on("checkin", handleCheckin)
    console.log("Socket listener for 'checkin' event has been set up")

    return () => {
      console.log("RealtimeCheckinTable unmounting - Cleaning up socket listener")
      socket.off("checkin", handleCheckin)
    }
  }, [])
  // Lọc check-in theo tìm kiếm và phòng ban
  const filteredCheckins = recentCheckins.filter((checkin) => {
    const matchesSearch =
      checkin.name.toLowerCase().includes(searchTerm.toLowerCase()) || checkin.id.toString().includes(searchTerm)
    const matchesDepartment = departmentFilter === "all" || checkin.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  // Format thời gian tương đối (ví dụ: "2 phút trước")
  const getRelativeTime = (date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds} giây trước`
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    return `${diffInHours} giờ trước`
  }

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
      </div>

      {/* Bảng check-in gần đây */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Check-in Gần Đây</CardTitle>
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
                  <TableHead>Khuôn Mặt</TableHead>
                  <TableHead>Giờ Check-in</TableHead>
                  <TableHead>Thời Gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCheckins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      Không có dữ liệu check-in nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCheckins.map((checkin) => (
                    <TableRow key={`${checkin.id}-${checkin.checkinTime.getTime()}`}>
                      <TableCell>{checkin.id}</TableCell>
                      <TableCell className="font-medium">{checkin.name}</TableCell>
                      <TableCell>{checkin.department}</TableCell>
                      <TableCell>{checkin.position}</TableCell>
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={checkin.faceImage || "/placeholder.svg"} alt="Khuôn mặt check-in" />
                          <AvatarFallback>KM</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>{checkin.formattedTime}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          {getRelativeTime(checkin.checkinTime)}
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
