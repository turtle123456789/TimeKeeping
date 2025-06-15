'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useEmployees } from '@/hooks/use-employees'

const AssignPermissions = () => {
  const { departments } = useEmployees()
  const [devices, setDevices] = useState([])

  const [selectedAdminId, setSelectedAdminId] = useState(null)
  const [permissions, setPermissions] = useState({
    departments: {},
    devices: {},
  })

  // Giả định gọi API để lấy danh sách thiết bị
  const fetchDevices = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/devices`)
      const result = await response.json()
      setDevices(result.data)
    } catch (err) {
      toast.error('Không thể tải danh sách thiết bị')
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  const handleAdminChange = (e) => {
    const adminId = e.target.value
    setSelectedAdminId(adminId)

    // Reset permissions khi chọn admin khác
    setPermissions({
      departments: {},
      devices: {},
    })
  }

  const togglePermission = (type, id) => {
    setPermissions((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [id]: !prev[type][id],
      },
    }))
  }

  const handleSavePermissions = async () => {
    if (!selectedAdminId) {
      toast.warning('Vui lòng chọn admin')
      return
    }

    try {
      const body = {
        adminId: selectedAdminId,
        permissions,
      }

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins/${selectedAdminId}/permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      toast.success('Phân quyền thành công')
    } catch (err) {
      toast.error('Lỗi khi phân quyền')
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-6">
      <CardContent className="space-y-4 py-6">
        <div>
          <Label>Chọn Admin</Label>
          <select
            className="w-full border border-gray-300 rounded px-2 py-2 mt-1"
            value={selectedAdminId || ''}
            onChange={handleAdminChange}
          >
            <option value="">-- Chọn admin --</option>
            <option key={"s"} value={"s"}>
                {"amdin 1"} Email admin
              </option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="text-lg">Phân quyền phòng ban</Label>
            <div className="mt-2 space-y-2">
              {departments.map((dept) => (
                <div key={dept._id} className="flex items-center gap-2">
                  <Checkbox
                    checked={permissions.departments[dept._id] || false}
                    onCheckedChange={() => togglePermission('departments', dept._id)}
                  />
                  <span>{dept.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-lg">Phân quyền thiết bị</Label>
            <div className="mt-2 space-y-2">
              {devices.map((device) => (
                <div key={device._id} className="flex items-center gap-2">
                  <Checkbox
                    checked={permissions.devices[device._id] || false}
                    onCheckedChange={() => togglePermission('devices', device._id)}
                  />
                  <span>{device.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-right pt-4">
          <Button onClick={handleSavePermissions}>Lưu phân quyền</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AssignPermissions
