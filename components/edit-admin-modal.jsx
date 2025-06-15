"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"

export function EditAdminModal({ isOpen, onClose, adminId }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
  })

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (adminId && isOpen) {
      getAdminById(adminId).then((data) => {
        setFormData({
          fullName: data.fullName || "",
          email: data.email || "",
          role: data.role || "",
        })
      })
    }
  }, [adminId, isOpen])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async () => {
    if (!adminId) return
    setIsSaving(true)
    try {
      await updateAdminById(adminId, formData)
      onClose()
    } catch (error) {
      console.error("Cập nhật thất bại:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa Admin</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="fullName">Họ tên</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ tên"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="role">Vai trò</Label>
            <Input
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Nhập vai trò (admin, manager,...)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
