IPO các tính năng trang quản lý sản phẩm (admin)

*Hiển thị danh sách sản phẩm (Read)
_Input: người dùng vào trang quản lý sản phẩm
_Process: 
 B1: Nhận yêu cầu lấy danh sách sản phẩm và gọi API GET /api/ProductApi/getall
 B2: Lấy danh sách sản phẩm từ Database
 B3: Trả dữ liệu về FE
 B4: FE render danh sách sản phẩm
_Output: hiển thị danh sách sản phẩm dạng bảng

*Thêm mới sản phẩm (Create)
_Input: thông tin người dùng nhập vào (id, name, price, img, description, type)
ID: là mã duy nhất nên không được nhập trùng lặp với dữ liệu đang có trong database
_Process:
 B1: Nhận dữ liệu người dùng nhập POST /api/ProductApi/create
 B2: kiểm tra dữ liệu và kiểu dữ liệu (Validate Data)
 B3: kiểm tra sản phẩm có bị trùng không?
 B4: Lưu sản phẩm vào Database
 B5: Trả kết quả về Fe
_Output:+thành công: thông báo thêm sản phẩm thành công và trả về thông tin sản phẩm vừa tạo
	+thất bại: thông báo lỗi dữ liệu/ thông báo lỗi hệ thống

*Cập nhật/ chỉnh sửa thông tin sản phẩm (Update)
_Input: người dùng chọn sản phẩm và nhập thông tin cần thay đổi (name, price, img, description, type)
_Process:
 B1: người dùng chọn sản phẩm cần sửa
 B2: hệ thống lấy GET /api/ProductApi/get/{id} và hiển thị thông tin sản phẩm được chọn lên form
 B3: người dùng chỉnh sửa (không cho phép thay đổi id) và nhấn "Cập nhật"
 B4: PUT /api/ProductApi/update/{id}
 B6: Validate thông tin mới
 B7: cập nhật thông tin mới vào Database
 B8: trả kết quả về Fe
 B9: Fe cập nhật lại danh sách
_Output: Thông báo cập nhật thành công và hiển thị thông tin sản phẩm mới

*Xoá sản phẩm đã được chọn (Delete)
_Input: chọn sản phẩm (Product ID) cần xoá và nhấn xoá sản phẩm
_Process:
 B1: người dùng chọn và nhấn "Xoá"
 B2: Fe lấy productId và yêu cầu DELETE /api/ProductApi/delete/{id}
 B3: Be nhận và kiểm tra productId
 B4: Xoá sản phẩm khỏi Database
 B5: trả kết quả về Fe
 B6: Fe cập nhật lại danh sách
_Output: thông báo xoá thành công và cập nhật danh sách sản phẩm

