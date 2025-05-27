/**
 * Hook quản lý dữ liệu nhân viên
 * Cung cấp các hàm để thêm, sửa, xóa và lấy thông tin nhân viên
 */
"use client"

import { useState, useEffect } from "react"

// Mock data cho nhân viên
const initialEmployees = [
  {
    id: 100001,
    name: "Nguyễn Văn A",
    position: "Lập Trình Viên",
    department: "CNTT",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    joinDate: "01/01/2020",
    status: "present",
    checkIn: "08:02",
    checkOut: "17:15",
    attendanceStatus: "ontime",
    timeDifference: "Đúng giờ",
    overtimeHours: "1.2",
    lastFaceImage: "/placeholder.svg?height=80&width=80",
    lastFaceTime: "08:02 15/04/2023",
    image: "/placeholder.svg?height=200&width=200",
    faceImage: "/placeholder.svg?height=200&width=200",
    faceRegistrationTime: "15/01/2023 09:30",
    shift: "fullday",
    salary: { baseSalary: 10000000, hourlyRate: 60000, overtimeRate: 90000, bonus: 1000000 },
  },
  {
    id: 100002,
    name: "Trần Thị B",
    position: "Thiết Kế Viên",
    department: "Thiết Kế",
    email: "tranthib@example.com",
    phone: "0123456788",
    joinDate: "15/03/2021",
    status: "present",
    checkIn: "07:45",
    checkOut: "17:30",
    attendanceStatus: "early",
    timeDifference: "Sớm 15 phút",
    overtimeHours: "1.5",
    lastFaceImage: "/placeholder.svg?height=80&width=80",
    lastFaceTime: "07:45 15/04/2023",
    image: "/placeholder.svg?height=200&width=200",
    faceImage: "/placeholder.svg?height=200&width=200",
    faceRegistrationTime: "20/03/2021 10:15",
    shift: "afternoon",
    salary: { baseSalary: 9000000, hourlyRate: 55000, overtimeRate: 85000, bonus: 800000 },
  },
  {
    id: 100003,
    name: "Lê Văn C",
    position: "Quản Lý",
    department: "Nhân Sự",
    email: "levanc@example.com",
    phone: "0123456787",
    joinDate: "10/05/2019",
    status: "late",
    checkIn: "09:15",
    checkOut: "18:00",
    attendanceStatus: "late",
    timeDifference: "Muộn 1 giờ 15 phút",
    overtimeHours: "2.0",
    lastFaceImage: "/placeholder.svg?height=80&width=80",
    lastFaceTime: "09:15 15/04/2023",
    image: "/placeholder.svg?height=200&width=200",
    faceImage: "/placeholder.svg?height=200&width=200",
    faceRegistrationTime: "15/05/2019 08:30",
    shift: "morning",
    salary: { baseSalary: 15000000, hourlyRate: 80000, overtimeRate: 120000, bonus: 1200000 },
  },
  {
    id: 100004,
    name: "Phạm Thị D",
    position: "Kế Toán",
    department: "Tài Chính",
    email: "phamthid@example.com",
    phone: "0123456786",
    joinDate: "05/08/2020",
    status: "absent",
    checkIn: "-",
    checkOut: "-",
    attendanceStatus: "absent",
    timeDifference: "-",
    overtimeHours: "0",
    lastFaceImage: null,
    lastFaceTime: "-",
    image: "/placeholder.svg?height=200&width=200",
    faceImage: "/placeholder.svg?height=200&width=200",
    faceRegistrationTime: "10/08/2020 09:00",
    shift: "fullday",
    salary: { baseSalary: 12000000, hourlyRate: 70000, overtimeRate: 100000, bonus: 1100000 },
  },
  {
    id: 100005,
    name: "Hoàng Văn E",
    position: "Lập Trình Viên",
    department: "CNTT",
    email: "hoangvane@example.com",
    phone: "0123456785",
    joinDate: "20/02/2022",
    status: "present",
    checkIn: "07:55",
    checkOut: "17:10",
    attendanceStatus: "early",
    timeDifference: "Sớm 5 phút",
    overtimeHours: "1.1",
    lastFaceImage: "/placeholder.svg?height=80&width=80",
    lastFaceTime: "07:55 15/04/2023",
    image: "/placeholder.svg?height=200&width=200",
    faceImage: "/placeholder.svg?height=200&width=200",
    faceRegistrationTime: "25/02/2022 10:30",
    shift: "afternoon",
    salary: { baseSalary: 10000000, hourlyRate: 60000, overtimeRate: 90000, bonus: 900000 },
  },
  {
    id: 100006,
    name: "Nguyễn Thị F",
    position: "Marketing",
    department: "Marketing",
    email: "nguyenthif@example.com",
    phone: "0123456784",
    joinDate: "15/10/2021",
    status: "present",
    checkIn: "08:10",
    checkOut: "17:05",
    attendanceStatus: "late",
    timeDifference: "Muộn 10 phút",
    overtimeHours: "0.9",
    lastFaceImage: "/placeholder.svg?height=80&width=80",
    lastFaceTime: "08:10 15/04/2023",
    image: "/placeholder.svg?height=200&width=200",
    faceImage: "/placeholder.svg?height=200&width=200",
    faceRegistrationTime: "20/10/2021 09:45",
    shift: "morning",
    salary: { baseSalary: 9500000, hourlyRate: 58000, overtimeRate: 87000, bonus: 700000 },
  },
  {
    id: 100007,
    name: "Đỗ Văn G",
    position: "Nhân Viên",
    department: "Hành Chính",
    email: "dovang@example.com",
    phone: "0123456783",
    joinDate: "05/01/2023",
    status: "present",
    checkIn: "08:00",
    checkOut: "17:00",
    attendanceStatus: "ontime",
    timeDifference: "Đúng giờ",
    overtimeHours: "0",
    lastFaceImage: "/placeholder.svg?height=80&width=80",
    lastFaceTime: "08:00 15/04/2023",
    image: "/placeholder.svg?height=200&width=200",
    faceImage: "/placeholder.svg?height=200&width=200",
    faceRegistrationTime: "10/01/2023 14:30",
    shift: "fullday",
    salary: { baseSalary: 8000000, hourlyRate: 50000, overtimeRate: 75000, bonus: 600000 },
  },
  // Thêm nhân viên mới từ thiết bị Android (chưa có thông tin đầy đủ)
  {
    id: 100008,
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
    joinDate: "",
    status: "new",
    checkIn: "-",
    checkOut: "-",
    attendanceStatus: "new",
    timeDifference: "-",
    overtimeHours: "0",
    lastFaceImage: null,
    lastFaceTime: "-",
    image: "/placeholder.svg?height=200&width=200",
    faceImage: "/placeholder.svg?height=200&width=200",
    faceRegistrationTime: "15/04/2023 10:30",
    shift: "",
    salary: { baseSalary: 0, hourlyRate: 0, overtimeRate: 0, bonus: 0 },
  },
]

// Định nghĩa các ca làm việc
export const SHIFTS = {
  morning: {
    name: "Ca Sáng",
    startTime: "08:00",
    endTime: "12:00",
  },
  afternoon: {
    name: "Ca Chiều",
    startTime: "13:00",
    endTime: "17:00",
  },
  fullday: {
    name: "Cả Ngày",
    startTime: "08:00",
    endTime: "17:00",
  },
}

/**
 * Hook quản lý dữ liệu nhân viên
 * @returns {Object} Các hàm và dữ liệu liên quan đến nhân viên
 */
// Thêm console.log để debug
export function useEmployees() {
  // State lưu trữ danh sách nhân viên
  const [employees, setEmployees] = useState([])
  // State lưu trữ danh sách phòng ban
  const [departments, setDepartments] = useState([])
  // State lưu trữ danh sách vị trí
  const [positions, setPositions] = useState([])
  // State để theo dõi xem dữ liệu đã được khởi tạo chưa
  const [initialized, setInitialized] = useState(false)

  // Khởi tạo dữ liệu ban đầu
  useEffect(() => {
    if (!initialized) {
      setEmployees(initialEmployees)

      // Lấy danh sách phòng ban và vị trí duy nhất
      const depts = [...new Set(initialEmployees.map((emp) => emp.department).filter(Boolean))]
      const pos = [...new Set(initialEmployees.map((emp) => emp.position).filter(Boolean))]

      setDepartments(depts)
      setPositions(pos)
      setInitialized(true)
    }
  }, [initialized])

  /**
   * Lấy thông tin nhân viên theo ID
   * @param {number} id - ID của nhân viên
   * @returns {Object|undefined} Thông tin nhân viên hoặc undefined nếu không tìm thấy
   */
  const getEmployeeById = (id) => {
    return employees.find((emp) => emp.id === id)
  }

  /**
   * Cập nhật thông tin nhân viên
   * @param {number} id - ID của nhân viên cần cập nhật
   * @param {Object} data - Dữ liệu cần cập nhật
   */
  const updateEmployee = (id, data) => {
    // Cập nhật thông tin nhân viên
    setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, ...data } : emp)))

    // Cập nhật danh sách phòng ban và vị trí nếu có mới
    if (data.department && !departments.includes(data.department)) {
      setDepartments((prev) => [...prev, data.department])
    }

    if (data.position && !positions.includes(data.position)) {
      setPositions((prev) => [...prev, data.position])
    }
  }

  /**
   * Xóa nhân viên
   * @param {number} id - ID của nhân viên cần xóa
   */
  const deleteEmployee = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id))
  }

  /**
   * Thêm phòng ban mới
   * @param {string} department - Tên phòng ban mới
   */
  const addDepartment = (department) => {
    if (!departments.includes(department)) {
      setDepartments((prev) => [...prev, department])
    }
  }

  /**
   * Thêm vị trí mới
   * @param {string} position - Tên vị trí mới
   */
  const addPosition = (position) => {
    if (!positions.includes(position)) {
      setPositions((prev) => [...prev, position])
    }
  }

  // Trả về các hàm và dữ liệu
  return {
    employees,
    departments,
    positions,
    updateEmployee,
    deleteEmployee,
    addDepartment,
    addPosition,
    getEmployeeById,
  }
}
