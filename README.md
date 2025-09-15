# IOT CONTROL SYSTEM  
_Web điều khiển thiết bị điện gia dụng từ xa sử dụng mạch ESP32_

## Mô tả dự án
Ứng dụng web cho phép người dùng:
- Đăng ký/đăng nhập tài khoản.
- Liên kết mạch ESP32 bằng **circuitId**.
- Bật/tắt thiết bị điện gia dụng theo thời gian thực.
- Xem lịch sử bật/tắt thiết bị và thông báo đăng nhập.
- Khôi phục mật khẩu qua email.

Toàn bộ dữ liệu và xác thực được lưu trữ trên **Firebase**.

## Tính năng chính
- **Đăng ký/Đăng nhập** bằng Firebase Authentication.
- **Main screen** hiển thị danh sách thiết bị, bật/tắt realtime.
- **Profile screen** cho phép cập nhật `circuitId`.
- **History screen** lưu tối đa 10 bản ghi bật/tắt.
- **Notifications screen** lưu tối đa 5 thông báo đăng nhập.
- **Retrieve password screen** gửi email đặt lại mật khẩu.
- Modal thiết bị: đếm giờ hoạt động, cảnh báo nếu bật quá 8 giờ.

## Cấu trúc cơ sở dữ liệu Firebase (Cloud Firestore)
```
•	Collection ID: users 
-	Document ID: userId lấy từ firebase auth
-	Fields: 
	username: string 
	email: string 
	circuitId: string 
	createdAt: timestamp 
	userId: string (lấy từ firebase auth) 
•	Collection ID: devices 
-	Document ID: deviceId
-	Fields: 
	deviceId: string 
	circuitId: string 
	name: string 
	status: boolean: true/false 
	lastUpdated: timestamp 
•	Collection ID: history 
-	Document ID: tạo ngẫu nhiên 
-	Fields: 
	deviceId: string 
	status: boolean: true/false 
	timestamp: timestamp 
	deviceName: string
•	Collection ID: notifications 
-	Document ID: tạo ngẫu nhiên
-	Fields: 
	userId: string 
	message: string
	timestamp: timestamp 

```

## Công nghệ sử dụng
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Firebase Authentication, Cloud Firestore
- **Hardware:** ESP32 (gửi trạng thái thiết bị lên Firestore)

## Cài đặt & chạy
1. **Clone repo**
   ```bash
   git clone https://github.com/HMN011104/IOTPJ.git
   cd <repo-name>
   ```
2. **Cấu hình Firebase**
   - Tạo project trên [Firebase Console](https://console.firebase.google.com/u/0/project/iot-control-system-c099c).
   - Kích hoạt Authentication (Email/Password).
   - Tạo Cloud Firestore Database.
   - Lấy cấu hình Web App và dán vào `firebase-config.js` (hoặc file tương ứng).

3. **Chạy thử bằng Python server**
   - Cài đặt Python 3.
   - Trong thư mục gốc dự án, chạy:
     ```bash
     python -m http.server 8000
     ```
   - Mở trình duyệt: [http://localhost:8000](http://localhost:8000)

4. **Triển khai**
   - Live test: https://hmn011104.github.io/IOTPJ/

## ESP32
- ESP32 gửi dữ liệu trạng thái thiết bị (bật/tắt) lên Firestore thông qua REST API/Firebase SDK.
- Mỗi thiết bị gắn `circuitId` trùng với tài khoản để hiển thị đúng cho user.

## Contact & Support
**Student**: Huỳnh Minh Nhựt 
**MSSV**: 2251120371 
**Email**: 2251120371
**Class**: CN22G

*Last updated: September 2025*
