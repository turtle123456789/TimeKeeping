/**
 * Component quản lý bộ phận và vị trí
 * Cho phép thêm, xem, chỉnh sửa và xóa các bộ phận và vị trí trong hệ thống
 */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDepartments } from "@/hooks/use-departments"
import { Edit, Trash2, Save, X, Building, Briefcase } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DepartmentManagement() {
  const {
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
  } = useDepartments()

  // State cho thêm bộ phận mới
  const [newDepartment, setNewDepartment] = useState("")
  const [showAddDepartmentDialog, setShowAddDepartmentDialog] = useState(false)

  // State cho thêm vị trí mới
  const [newPosition, setNewPosition] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [showAddPositionDialog, setShowAddPositionDialog] = useState(false)

  // State cho chỉnh sửa
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [editingPosition, setEditingPosition] = useState(null)
  const [editValue, setEditValue] = useState("")

  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")

  // Lấy danh sách bộ phận và vị trí
  const departments = getAllDepartments()
  const positions = getAllPositions()

  // Lọc bộ phận theo từ khóa tìm kiếm
  const filteredDepartments = departments.filter((dept) => dept.toLowerCase().includes(searchTerm.toLowerCase()))

  // Lọc vị trí theo bộ phận được chọn
  const filteredPositions = filterDepartment === "all" ? positions : getPositionsByDepartment(filterDepartment)

  // Xử lý thêm bộ phận mới
  const handleAddDepartment = () => {
    if (newDepartment.trim()) {
      addDepartment(newDepartment.trim())
      setNewDepartment("")
      setShowAddDepartmentDialog(false)
    }
  }

  // Xử lý thêm vị trí mới
  const handleAddPosition = () => {
    if (newPosition.trim() && selectedDepartment) {
      addPosition(selectedDepartment, newPosition.trim())
      setNewPosition("")
      setShowAddPositionDialog(false)
    }
  }

  // Xử lý bắt đầu chỉnh sửa bộ phận
  const startEditDepartment = (department) => {
    setEditingDepartment(department)
    setEditValue(department)
  }

  // Xử lý bắt đầu chỉnh sửa vị trí
  const startEditPosition = (position) => {
    setEditingPosition(position)
    setEditValue(position)
  }

  // Xử lý hủy chỉnh sửa
  const cancelEdit = () => {
    setEditingDepartment(null)
    setEditingPosition(null)
    setEditValue("")
  }

  // Xử lý lưu chỉnh sửa bộ phận
  const saveEditDepartment = () => {
    if (editValue.trim() && editingDepartment) {
      updateDepartment(editingDepartment, editValue.trim())
      setEditingDepartment(null)
    }
  }

  // Xử lý lưu chỉnh sửa vị trí
  const saveEditPosition = () => {
    if (editValue.trim() && editingPosition) {
      // Tìm bộ phận chứa vị trí này
      for (const dept of departmentPositions) {
        if (dept.positions.includes(editingPosition)) {
          updatePosition(dept.department, editingPosition, editValue.trim())
          break
        }
      }
      setEditingPosition(null)
    }
  }

  // Xử lý xóa bộ phận
  const handleDeleteDepartment = (department) => {
    deleteDepartment(department)
  }

  // Xử lý xóa vị trí
  const handleDeletePosition = (position) => {
    // Tìm bộ phận chứa vị trí này
    for (const dept of departmentPositions) {
      if (dept.positions.includes(position)) {
        deletePosition(dept.department, position)
        break
      }
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="departments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="departments">Quản Lý Bộ Phận</TabsTrigger>
          <TabsTrigger value="positions">Quản Lý Vị Trí</TabsTrigger>
          <TabsTrigger value="filter">Lọc Vị Trí Theo Bộ Phận</TabsTrigger>
        </TabsList>

        {/* Tab Quản Lý Bộ Phận */}
        <TabsContent value="departments">
          {/* Phần tìm kiếm và nút thêm mới */}
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
            <div className="relative w-full md:w-1/3">
              <Input
                placeholder="Tìm kiếm bộ phận..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <div className="absolute left-3 top-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            </div>
            <Dialog open={showAddDepartmentDialog} onOpenChange={setShowAddDepartmentDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Building className="mr-2 h-4 w-4" />
                  Thêm Bộ Phận
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm Bộ Phận Mới</DialogTitle>
                  <DialogDescription>Nhập tên bộ phận mới để thêm vào hệ thống.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Tên Bộ Phận
                    </Label>
                    <Input
                      id="name"
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      className="col-span-3"
                      placeholder="Nhập tên bộ phận"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDepartmentDialog(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleAddDepartment}>Thêm Bộ Phận</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Bảng bộ phận */}
          <Card>
            <CardHeader>
              <CardTitle>Danh Sách Bộ Phận</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Bộ Phận</TableHead>
                      <TableHead>Số Lượng Vị Trí</TableHead>
                      <TableHead className="text-right w-[150px]">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDepartments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                          Không tìm thấy bộ phận nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDepartments.map((department) => {
                        const departmentPositions = getPositionsByDepartment(department)

                        return (
                          <TableRow key={department}>
                            <TableCell className="font-medium">
                              {editingDepartment === department ? (
                                <div className="flex items-center space-x-2">
                                  <Input
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="h-8"
                                  />
                                  <Button size="icon" variant="ghost" onClick={saveEditDepartment} className="h-8 w-8">
                                    <Save className="h-4 w-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost" onClick={cancelEdit} className="h-8 w-8">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                                  {department}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{departmentPositions.length} vị trí</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button size="sm" variant="ghost" onClick={() => startEditDepartment(department)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="ghost" className="text-red-500">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Bạn có chắc chắn muốn xóa bộ phận "{department}"? Hành động này không thể hoàn
                                        tác.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteDepartment(department)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Xóa
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
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
        </TabsContent>

        {/* Tab Quản Lý Vị Trí */}
        <TabsContent value="positions">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
            <div className="relative w-full md:w-1/3">
              <Input
                placeholder="Tìm kiếm vị trí..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <div className="absolute left-3 top-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            </div>
            <Dialog open={showAddPositionDialog} onOpenChange={setShowAddPositionDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Thêm Vị Trí
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm Vị Trí Mới</DialogTitle>
                  <DialogDescription>Chọn bộ phận và nhập tên vị trí mới.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                      Bộ Phận
                    </Label>
                    <div className="col-span-3">
                      <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn bộ phận" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="position" className="text-right">
                      Tên Vị Trí
                    </Label>
                    <Input
                      id="position"
                      value={newPosition}
                      onChange={(e) => setNewPosition(e.target.value)}
                      className="col-span-3"
                      placeholder="Nhập tên vị trí"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddPositionDialog(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleAddPosition}>Thêm Vị Trí</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Bảng quản lý vị trí */}
          <Card>
            <CardHeader>
              <CardTitle>Quản Lý Vị Trí</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vị Trí</TableHead>
                      <TableHead>Thuộc Bộ Phận</TableHead>
                      <TableHead className="text-right">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                          Chưa có vị trí nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      positions
                        .filter((position) => position.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((position) => {
                          // Tìm các bộ phận chứa vị trí này
                          const deptWithPosition = departmentPositions
                            .filter((dept) => dept.positions.includes(position))
                            .map((dept) => dept.department)

                          return (
                            <TableRow key={position}>
                              <TableCell className="font-medium">
                                {editingPosition === position ? (
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      className="h-8"
                                    />
                                    <Button size="icon" variant="ghost" onClick={saveEditPosition} className="h-8 w-8">
                                      <Save className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={cancelEdit} className="h-8 w-8">
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                                    {position}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-2">
                                  {deptWithPosition.map((dept) => (
                                    <Badge key={dept} variant="outline">
                                      {dept}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button size="sm" variant="ghost" onClick={() => startEditPosition(position)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button size="sm" variant="ghost" className="text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Bạn có chắc chắn muốn xóa vị trí "{position}"? Hành động này không thể hoàn
                                          tác.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeletePosition(position)}
                                          className="bg-red-500 hover:bg-red-600"
                                        >
                                          Xóa
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
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
        </TabsContent>

        {/* Tab Lọc Vị Trí Theo Bộ Phận */}
        <TabsContent value="filter">
          <Card>
            <CardHeader>
              <CardTitle>Lọc Vị Trí Theo Bộ Phận</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="filter-department" className="mb-2 block">
                  Chọn Bộ Phận
                </Label>
                <div className="flex gap-2">
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger id="filter-department" className="w-full md:w-1/3">
                      <SelectValue placeholder="Chọn bộ phận" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả bộ phận</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vị Trí</TableHead>
                      <TableHead>Thuộc Bộ Phận</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPositions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-10 text-muted-foreground">
                          Không tìm thấy vị trí nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPositions.map((position) => {
                        // Tìm các bộ phận chứa vị trí này
                        const deptWithPosition =
                          filterDepartment === "all"
                            ? departmentPositions
                                .filter((dept) => dept.positions.includes(position))
                                .map((dept) => dept.department)
                            : [filterDepartment]

                        return (
                          <TableRow key={position}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                                {position}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-2">
                                {deptWithPosition.map((dept) => (
                                  <Badge key={dept} variant="outline">
                                    {dept}
                                  </Badge>
                                ))}
                              </div>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
