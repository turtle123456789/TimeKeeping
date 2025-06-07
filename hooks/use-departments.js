/**
 * Hook quản lý dữ liệu bộ phận và vị trí
 * Cung cấp các hàm để thêm, sửa, xóa và lấy thông tin bộ phận và vị trí
 */
"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"

// API endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
const DEPARTMENTS_ENDPOINT = `${API_BASE_URL}/departments`
const POSITIONS_ENDPOINT = `${API_BASE_URL}/positions`

/**
 * Hook quản lý dữ liệu bộ phận và vị trí
 * @returns {Object} Các hàm và dữ liệu liên quan đến bộ phận và vị trí
 */
export function useDepartments() {
  // State lưu trữ danh sách bộ phận và vị trí
  const [departments, setDepartments] = useState([])
  const [positions, setPositions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch departments data
  const fetchDepartments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(DEPARTMENTS_ENDPOINT)
      if (!response.ok) {
        throw new Error("Failed to fetch departments")
      }
      const result = await response.json()
      setDepartments(result.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching departments:", err)
      setError(err.message)
      toast.error("Không thể tải danh sách bộ phận")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch positions data
  const fetchPositions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(POSITIONS_ENDPOINT)
      if (!response.ok) {
        throw new Error("Failed to fetch positions")
      }
      const result = await response.json()
      setPositions(result.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching positions:", err)
      setError(err.message)
      toast.error("Không thể tải danh sách vị trí")
    } finally {
      setIsLoading(false)
    }
  }

  // Load data on mount
  useEffect(() => {
    fetchDepartments()
    fetchPositions()
  }, [])

  /**
   * Lấy danh sách tất cả các bộ phận
   * @returns {Array} Danh sách các bộ phận
   */
  const getAllDepartments = () => {
    return departments
  }

  /**
   * Lấy danh sách tất cả các vị trí
   * @returns {Array} Danh sách các vị trí
   */
  const getAllPositions = () => {
    return positions
  }

  /**
   * Lấy danh sách vị trí theo bộ phận
   * @param {string} departmentId - ID của bộ phận
   * @returns {Array} Danh sách vị trí thuộc bộ phận
   */
  const getPositionsByDepartment = async (departmentId) => {
    try {
      const response = await fetch(`${POSITIONS_ENDPOINT}/department/${departmentId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch positions by department")
      }
      const data = await response.json()
      return data
    } catch (err) {
      console.error("Error fetching positions by department:", err)
      toast.error("Không thể tải danh sách vị trí của bộ phận")
      return []
    }
  }

  /**
   * Thêm bộ phận mới
   * @param {string} name - Tên bộ phận mới
   */
  const addDepartment = async (name) => {
    try {
      setIsLoading(true)
      const response = await fetch(DEPARTMENTS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error("Failed to add department")
      }

      // Refresh departments data after adding
      await fetchDepartments()
      toast.success("Thêm bộ phận thành công")
    } catch (err) {
      console.error("Error adding department:", err)
      toast.error("Không thể thêm bộ phận mới")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Thêm vị trí mới
   * @param {string} name - Tên vị trí mới
   * @param {string} departmentId - ID của bộ phận
   */
  const addPosition = async (name, departmentId) => {
    try {
      setIsLoading(true)
      const response = await fetch(POSITIONS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, department: departmentId }),
      })

      if (!response.ok) {
        throw new Error("Failed to add position")
      }

      // Refresh both departments and positions data after adding
      await Promise.all([fetchDepartments(), fetchPositions()])
      toast.success("Thêm vị trí thành công")
    } catch (err) {
      console.error("Error adding position:", err)
      toast.error("Không thể thêm vị trí mới")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Cập nhật tên bộ phận
   * @param {string} departmentId - ID của bộ phận
   * @param {string} name - Tên mới của bộ phận
   */
  const updateDepartment = async (departmentId, name) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${DEPARTMENTS_ENDPOINT}/${departmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error("Failed to update department")
      }

      // Refresh departments data after updating
      await fetchDepartments()
      toast.success("Cập nhật bộ phận thành công")
    } catch (err) {
      console.error("Error updating department:", err)
      toast.error("Không thể cập nhật bộ phận")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Cập nhật tên vị trí
   * @param {string} positionId - ID của vị trí
   * @param {string} name - Tên mới của vị trí
   */
  const updatePosition = async (positionId, name) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${POSITIONS_ENDPOINT}/${positionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error("Failed to update position")
      }

      // Refresh both departments and positions data after updating
      await Promise.all([fetchDepartments(), fetchPositions()])
      toast.success("Cập nhật vị trí thành công")
    } catch (err) {
      console.error("Error updating position:", err)
      toast.error("Không thể cập nhật vị trí")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Xóa bộ phận
   * @param {string} departmentId - ID của bộ phận cần xóa
   */
  const deleteDepartment = async (departmentId) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${DEPARTMENTS_ENDPOINT}/${departmentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete department")
      }

      // Refresh both departments and positions data after deleting
      await Promise.all([fetchDepartments(), fetchPositions()])
      toast.success("Xóa bộ phận thành công")
    } catch (err) {
      console.error("Error deleting department:", err)
      toast.error("Không thể xóa bộ phận")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Xóa vị trí
   * @param {string} positionId - ID của vị trí cần xóa
   */
  const deletePosition = async (positionId) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${POSITIONS_ENDPOINT}/${positionId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete position")
      }

      // Refresh both departments and positions data after deleting
      await Promise.all([fetchDepartments(), fetchPositions()])
      toast.success("Xóa vị trí thành công")
    } catch (err) {
      console.error("Error deleting position:", err)
      toast.error("Không thể xóa vị trí")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Trả về các hàm và dữ liệu
  return {
    departments,
    positions,
    isLoading,
    error,
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
