# CyberPhone

## Các bước chạy dự án

1. Tải và cài đặt [Node.js](https://nodejs.org/).
2. Mở thư mục dự án bằng Visual Studio Code.
3. Mở Terminal tại thư mục dự án và chạy lệnh:

```bash
npm i
```

4. Cài đặt extension **Live Sass Compiler** trong Visual Studio Code.
5. Sử dụng Live Sass Compiler để biên dịch ngôn ngữ Sass sang CSS.
6. Cài đặt extension **Live Server**.
7. Nhấp chuột phải vào file `index.html`, chọn **Open with Live Server** để chạy website trên trình duyệt.

## Đường dẫn truy cập

Live Server cần được khởi động từ thư mục gốc `CyberPhone` để giữ đúng cấu trúc URL:

- Website: `http://127.0.0.1:5500/`
- Trang quản trị: `http://127.0.0.1:5500/server`

File `server/index.html` là entry point của trang quản trị và sẽ chuyển tiếp đến dashboard.
