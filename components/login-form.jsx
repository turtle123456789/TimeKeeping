/**
 * Component form đăng nhập cho hệ thống chấm công
 * Chỉ cho phép quản lý đăng nhập vào hệ thống
 */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, LogIn } from "lucide-react"

/**
 * Component form đăng nhập
 * Xử lý authentication và chuyển hướng sau khi đăng nhập thành công
 */
export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  /**
   * Xử lý sự kiện submit form đăng nhập
   * @param {Event} e - Event object
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Kiểm tra thông tin đăng nhập (demo)
      if (username === "admin" && password === "admin123") {
        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn đến với hệ thống chấm công!",
        })

        // Chuyển hướng đến trang check-in gần đây
        router.push("/dashboard/realtime")
      } else {
        toast({
          title: "Đăng nhập thất bại",
          description: "Tên đăng nhập hoặc mật khẩu không đúng.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi hệ thống",
        description: "Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Đăng Nhập</CardTitle>
        <CardDescription className="text-center">Nhập thông tin đăng nhập để truy cập hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
                <span className="sr-only">{showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}</span>
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Đang đăng nhập...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Đăng Nhập
              </>
            )}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Thông tin đăng nhập demo:</p>
          <p>
            Tên đăng nhập: <strong>admin</strong>
          </p>
          <p>
            Mật khẩu: <strong>admin123</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
