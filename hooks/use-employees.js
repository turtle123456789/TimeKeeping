/**
 * Hook quản lý dữ liệu nhân viên
 * Cung cấp các hàm để thêm, sửa, xóa và lấy thông tin nhân viên
 */
"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
const DEPARTMENTS_ENDPOINT = `${API_URL}/departments`
const POSITIONS_ENDPOINT = `${API_URL}/positions`
const EMPLOYEES_ENDPOINT = `${API_URL}/employees`


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
export function useEmployees() {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [positions, setPositions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await fetch(DEPARTMENTS_ENDPOINT)
      if (!response.ok) {
        throw new Error("Failed to fetch departments")
      }
      const result = await response.json()
      setDepartments(result.data)
    } catch (err) {
      console.error("Error fetching departments:", err)
      toast.error("Không thể tải danh sách phòng ban")
    }
  }

  // Fetch positions
  const fetchPositions = async () => {
    try {
      const response = await fetch(POSITIONS_ENDPOINT)
      if (!response.ok) {
        throw new Error("Failed to fetch positions")
      }
      const result = await response.json()
      setPositions(result.data)
    } catch (err) {
      console.error("Error fetching positions:", err)
      toast.error("Không thể tải danh sách vị trí")
    }
  }

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(EMPLOYEES_ENDPOINT)
      if (!response.ok) {
        throw new Error("Failed to fetch employees")
      }
      const result = await response.json()
      setEmployees(result.data)
    } catch (err) {
      console.error("Error fetching employees:", err)
      setError(err.message)
      toast.error("Không thể tải danh sách nhân viên")
    } finally {
      setIsLoading(false)
    }
  }

  // Get employee by ID
  const getEmployeeById = async (employeeId) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`${EMPLOYEES_ENDPOINT}/${employeeId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch employee")
      }
      const result = await response.json()
      console.log("Result12: ", result)
      return result.data
    } catch (err) {
      console.error("Error fetching employee:", err)
      setError(err.message)
      toast.error("Không thể tải thông tin nhân viên")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Add new employee
  const addEmployee = async (employeeData) => {
    try {
      const response = await fetch(EMPLOYEES_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      })

      if (!response.ok) {
        throw new Error("Failed to add employee")
      }

      const result = await response.json()
      toast.success("Thêm nhân viên thành công")
      await fetchEmployees() // Refresh the list
      return result.data
    } catch (err) {
      console.error("Error adding employee:", err)
      toast.error("Không thể thêm nhân viên")
      throw err
    }
  }

  // Update employee
  const updateEmployee = async (employeeId, employeeData) => {
    try {
      const response = await fetch(`${EMPLOYEES_ENDPOINT}/${employeeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      })

      if (!response.ok) {
        throw new Error("Failed to update employee")
      }

      const result = await response.json()
      toast.success("Cập nhật nhân viên thành công")
      await fetchEmployees() // Refresh the list
      return result.data
    } catch (err) {
      console.error("Error updating employee:", err)
      toast.error("Không thể cập nhật nhân viên")
      throw err
    }
  }

  // Delete employee
  const deleteEmployee = async (employeeId) => {
    try {
      const response = await fetch(`${EMPLOYEES_ENDPOINT}/${employeeId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete employee")
      }

      toast.success("Xóa nhân viên thành công")
      await fetchEmployees() // Refresh the list
    } catch (err) {
      console.error("Error deleting employee:", err)
      toast.error("Không thể xóa nhân viên")
      throw err
    }
  }

  // Load initial data
  useEffect(() => {
    fetchEmployees()
    fetchDepartments()
    fetchPositions()
  }, [])

  return {
    employees,
    departments,
    positions,
    isLoading,
    error,
    fetchEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  }
}
