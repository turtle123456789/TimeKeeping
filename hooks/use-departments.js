/**
 * Hook quản lý dữ liệu bộ phận và vị trí
 * Cung cấp các hàm để thêm, sửa, xóa và lấy thông tin bộ phận và vị trí
 */
"use client"

import { useState, useEffect } from "react"

// Dữ liệu mẫu cho bộ phận và vị trí
const initialDepartmentPositions = [
  {
    department: "CNTT",
    positions: ["Lập Trình Viên", "Quản Lý Dự Án", "Kỹ Sư Hệ Thống", "Kiểm Thử Phần Mềm"],
  },
  {
    department: "Thiết Kế",
    positions: ["Thiết Kế Viên", "Thiết Kế UX/UI", "Thiết Kế Đồ Họa"],
  },
  {
    department: "Nhân Sự",
    positions: ["Quản Lý", "Chuyên Viên Tuyển Dụng", "Chuyên Viên Đào Tạo"],
  },
  {
    department: "Tài Chính",
    positions: ["Kế Toán", "Chuyên Viên Tài Chính", "Kiểm Toán Viên"],
  },
  {
    department: "Marketing",
    positions: ["Marketing", "Chuyên Viên Truyền Thông", "Chuyên Viên SEO"],
  },
  {
    department: "Hành Chính",
    positions: ["Nhân Viên", "Thư Ký", "Lễ Tân"],
  },
]

/**
 * Hook quản lý dữ liệu bộ phận và vị trí
 * @returns {Object} Các hàm và dữ liệu liên quan đến bộ phận và vị trí
 */
export function useDepartments() {
  // State lưu trữ danh sách bộ phận và vị trí
  const [departmentPositions, setDepartmentPositions] = useState([])
  // State để theo dõi xem dữ liệu đã được khởi tạo chưa
  const [initialized, setInitialized] = useState(false)

  // Khởi tạo dữ liệu ban đầu
  useEffect(() => {
    if (!initialized) {
      setDepartmentPositions(initialDepartmentPositions)
      setInitialized(true)
    }
  }, [initialized])

  /**
   * Lấy danh sách tất cả các bộ phận
   * @returns {Array} Danh sách các bộ phận
   */
  const getAllDepartments = () => {
    return departmentPositions.map((item) => item.department)
  }

  /**
   * Lấy danh sách tất cả các vị trí
   * @returns {Array} Danh sách các vị trí
   */
  const getAllPositions = () => {
    const allPositions = new Set()
    departmentPositions.forEach((item) => {
      item.positions.forEach((position) => {
        allPositions.add(position)
      })
    })
    return Array.from(allPositions)
  }

  /**
   * Lấy danh sách vị trí theo bộ phận
   * @param {string} department - Tên bộ phận
   * @returns {Array} Danh sách vị trí thuộc bộ phận
   */
  const getPositionsByDepartment = (department) => {
    const deptItem = departmentPositions.find((item) => item.department === department)
    return deptItem ? deptItem.positions : []
  }

  /**
   * Thêm bộ phận mới
   * @param {string} department - Tên bộ phận mới
   */
  const addDepartment = (department) => {
    if (!departmentPositions.some((item) => item.department === department)) {
      setDepartmentPositions((prev) => [...prev, { department, positions: [] }])
    }
  }

  /**
   * Thêm vị trí mới cho bộ phận
   * @param {string} department - Tên bộ phận
   * @param {string} position - Tên vị trí mới
   */
  const addPosition = (department, position) => {
    setDepartmentPositions((prev) =>
      prev.map((item) =>
        item.department === department && !item.positions.includes(position)
          ? { ...item, positions: [...item.positions, position] }
          : item,
      ),
    )
  }

  /**
   * Cập nhật tên bộ phận
   * @param {string} oldName - Tên bộ phận cũ
   * @param {string} newName - Tên bộ phận mới
   */
  const updateDepartment = (oldName, newName) => {
    setDepartmentPositions((prev) =>
      prev.map((item) => (item.department === oldName ? { ...item, department: newName } : item)),
    )
  }

  /**
   * Cập nhật tên vị trí
   * @param {string} department - Tên bộ phận
   * @param {string} oldName - Tên vị trí cũ
   * @param {string} newName - Tên vị trí mới
   */
  const updatePosition = (department, oldName, newName) => {
    setDepartmentPositions((prev) =>
      prev.map((item) =>
        item.department === department
          ? {
              ...item,
              positions: item.positions.map((pos) => (pos === oldName ? newName : pos)),
            }
          : item,
      ),
    )
  }

  /**
   * Xóa bộ phận
   * @param {string} department - Tên bộ phận cần xóa
   */
  const deleteDepartment = (department) => {
    setDepartmentPositions((prev) => prev.filter((item) => item.department !== department))
  }

  /**
   * Xóa vị trí khỏi bộ phận
   * @param {string} department - Tên bộ phận
   * @param {string} position - Tên vị trí cần xóa
   */
  const deletePosition = (department, position) => {
    setDepartmentPositions((prev) =>
      prev.map((item) =>
        item.department === department
          ? {
              ...item,
              positions: item.positions.filter((pos) => pos !== position),
            }
          : item,
      ),
    )
  }

  // Trả về các hàm và dữ liệu
  return {
    departmentPositions,
    getAllDepartments,
    getAllPositions,
    getPositionsByDepartment,
    addDepartment,
    addPosition,
    updateDepartment,
    updatePosition,
    deleteDepartment,
    deletePosition,
  }
}
