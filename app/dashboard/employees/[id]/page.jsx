/**
 * Trang chi tiết nhân viên
 * Hiển thị thông tin chi tiết của một nhân viên và cho phép chỉnh sửa hoặc xóa
 */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { EmployeeDetails } from "@/components/employee-details"
import { AttendanceHistory } from "@/components/attendance-history"
import { MonthlyStats } from "@/components/monthly-stats"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEmployees } from "@/hooks/use-employees"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

/**
 * Component trang chi tiết nhân viên
 * @param {Object} props - Props của component
 * @param {Object} props.params - Tham số từ URL
 * @param {string} props.params.id - ID của nhân viên
 */
export default function EmployeePage({ params }) {
  const employeeId = Number.parseInt(params.id)
  const { getEmployeeById, deleteEmployee } = useEmployees()
  const [employee, setEmployee] = useState(undefined)
  const router = useRouter()

  // Lấy thông tin nhân viên khi component được tải
  useEffect(() => {
    const emp = getEmployeeById(employeeId)
    if (emp) {
      setEmployee(emp)
    }
  }, [employeeId, getEmployeeById])

  // Nếu không tìm thấy nhân viên, hiển thị trang 404
  if (!employee) {
    return <div className="p-8 text-center">Đang tải thông tin nhân viên...</div>
  }

  /**
   * Xử lý sự kiện xóa nhân viên
   */
  const handleDelete = () => {
    deleteEmployee(employeeId)
    router.push("/dashboard/employees")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/employees">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{employee.name || "Nhân viên mới"}</h1>
          <Badge className="ml-2">ID: {employee.id}</Badge>
        </div>
        <div className="flex gap-2">
          {/* Nút chỉnh sửa nhân viên */}
          <Link href={`/dashboard/employees/${employeeId}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh Sửa
            </Button>
          </Link>
          {/* Nút xóa nhân viên */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể hoàn tác. Nhân viên này sẽ bị xóa vĩnh viễn khỏi hệ thống.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {/* Thông tin chi tiết nhân viên */}
          <EmployeeDetails employee={employee} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          {/* Thống kê hàng tháng */}
          <MonthlyStats employeeId={employeeId} />
          {/* Lịch sử chấm công */}
          <AttendanceHistory employeeId={employeeId} />
        </div>
      </div>
    </div>
  )
}

/**
 * Component Badge hiển thị nhãn
 * @param {Object} props - Props của component
 * @param {React.ReactNode} props.children - Nội dung của badge
 * @param {string} props.className - Class CSS bổ sung
 */
function Badge({ children, className }) {
  return (
    <span className={`px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800 ${className || ""}`}>{children}</span>
  )
}
