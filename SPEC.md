# YÊU CẦU CHỨC NĂNG - DỰ ÁN KARNEL TRAVELS

**Tên dự án:** Karnel Travels - Website Du Lịch và Lữ Hành

**Phiên bản:** 1.0

**Ngày lập:** 10/03/2026

**Loại tài liệu:** Software Requirements Specification (SRS)

---

## 1. GIỚI THIỆU TỔNG QUAN

### 1.1. Mục đích tài liệu

Tài liệu này trình bày chi tiết các yêu cầu chức năng và phi chức năng cho hệ thống website Karnel Travels. Mục tiêu là xây dựng một nền tảng trực tuyến giúp công ty Karnel Travels tiếp cận khách hàng, cung cấp thông tin về các điểm du lịch, khách sạn, nhà hàng, resort và các dịch vụ vận chuyển trong nước.

### 1.2. Phạm vi dự án

- **Tên miền:** http://www.Karneltravelguide.com
- **Loại hình:** Website giới thiệu dịch vụ du lịch và lữ hành
- **Đối tượng phục vụ:** Khách hàng cá nhân và doanh nghiệp có nhu cầu đặt tour, đặt phòng khách sạn, tìm kiếm thông tin du lịch trong nước

### 1.3. Mô tả nghiệp vụ

Karnel Travels là công ty du lịch và lữ hành cung cấp các dịch vụ:
- Vận chuyển giữa các thành phố và điểm du lịch
- Dịch vụ lưu trú tại khách sạn, resort
- Các gói tour trọn gói
- Hướng dẫn du lịch và tư vấn

---

## 2. YÊU CẦU CHỨC NĂNG

### 2.1. Trang chủ (Home Page)

#### 2.1.1. Mô tả chức năng
Trang chủ là trang đầu tiên khi người dùng truy cập website, đóng vai trò điểm neo chính và cung cấp cái nhìn tổng quan về dịch vụ.

#### 2.1.2. Các yêu cầu cụ thể
| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F001 | F-HOME-001 | Hiển thị banner chính với hình ảnh/video giới thiệu các điểm du lịch nổi bật | Cao |
| F002 | F-HOME-002 | Hiển thị menu điều hướng chính ở vị trí dễ thấy (header) | Cao |
| F003 | F-HOME-003 | Hiển thị phần giới thiệu ngắn về công ty (giới thiệu tổng quan 3-5 câu) | Cao |
| F004 | F-HOME-004 | Hiển thị danh sách các điểm du lịch nổi bật (ít nhất 6 điểm) | Cao |
| F005 | F-HOME-005 | Hiển thị danh mục dịch vụ chính (vận chuyển, khách sạn, tour, resort) | Cao |
| F006 | F-HOME-006 | Hiển thị các gói du lịch/khuyến mãi hiện có | Trung bình |
| F007 | F-HOME-007 | Có nút kêu gọi hành động (Call-to-Action) dẫn đến trang đặt tour/liên hệ | Cao |
| F008 | F-HOME-008 | Hiển thị thông tin liên hệ nhanh (điện thoại, email) | Cao |
| F009 | F-HOME-009 | Responsive design - hiển thị tốt trên thiết bị di động | Cao |
| F010 | F-HOME-010 | Tích hợp các liên kết mạng xã hội (Facebook, Instagram, YouTube) | Trung bình |

---

### 2.2. Trang Giới thiệu (About Us)

#### 2.2.1. Mô tả chức năng
Trang giới thiệu cung cấp thông tin chi tiết về công ty, lịch sử phát triển, tầm nhìn - sứ mệnh và các dịch vụ mà công ty cung cấp.

#### 2.2.2. Các yêu cầu cụ thể
| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F011 | F-ABOUT-001 | Hiển thị tiêu đề trang "Giới thiệu về chúng tôi" | Cao |
| F012 | F-ABOUT-002 | Hiển thị lịch sử hình thành và phát triển của công ty | Cao |
| F013 | F-ABOUT-003 | Hiển thị tầm nhìn và sứ mệnh của công ty | Cao |
| F014 | F-ABOUT-004 | Hiển thị chi tiết các dịch vụ vận chuyển (xe khách, xe limousine, máy bay...) | Cao |
| F015 | F-ABOUT-005 | Hiển thị chi tiết các gói tour trọn gói | Cao |
| F016 | F-ABOUT-006 | Hiển thị thông tin về dịch vụ kết hợp vận chuyển và lưu trú | Cao |
| F017 | F-ABOUT-007 | Hiển thị danh sách các điểm đến du lịch mà công ty phục vụ | Cao |
| F018 | F-ABOUT-008 | Hiển thị hình ảnh minh họa (gallery về công ty, đội xe, khách sạn đối tác) | Trung bình |
| F019 | F-ABOUT-009 | Hiển thị các giải thưởng/chứng nhận (nếu có) | Trung bình |
| F020 | F-ABOUT-010 | Có liên kết đến trang liên hệ để đặt dịch vụ | Cao |

---

### 2.3. Trang Tìm kiếm (Search Page)

#### 2.3.1. Mô tả chức năng
Trang tìm kiếm cho phép người dùng tìm kiếm các điểm du lịch, khách sạn, nhà hàng và resort dựa trên nhiều tiêu chí khác nhau.

#### 2.3.2. Các yêu cầu cụ thể
| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F021 | F-SEARCH-001 | Thanh tìm kiếm chính với ô nhập liệu đa năng | Cao |
| F022 | F-SEARCH-002 | Tìm kiếm điểm du lịch theo loại (bãi biển, di tích, núi, thác nước...) | Cao |
| F023 | F-SEARCH-003 | Tìm kiếm khách sạn theo vị trí (thành phố, khu vực) | Cao |
| F024 | F-SEARCH-004 | Tìm kiếm khách sạn theo mức giá (khoảng giá) | Cao |
| F025 | F-SEARCH-005 | Tìm kiếm khách sạn theo hạng sao (1-5 sao) | Cao |
| F026 | F-SEARCH-006 | Tìm kiếm khách sạn theo tiện nghi (wifi, bể bơi, nhà hàng, gym...) | Trung bình |
| F027 | F-SEARCH-007 | Tìm kiếm khách sạn theo tình trạng phòng trống | Cao |
| F028 | F-SEARCH-008 | Tìm kiếm nhà hàng theo vị trí | Cao |
| F029 | F-SEARCH-009 | Tìm kiếm nhà hàng theo mức giá | Cao |
| F030 | F-SEARCH-010 | Tìm kiếm nhà hàng theo loại ẩm thực (Việt, Á, Âu, hải sản...) | Trung bình |
| F031 | F-SEARCH-011 | Tìm kiếm resort theo vị trí | Cao |
| F032 | F-SEARCH-012 | Tìm kiếm resort theo mức giá | Cao |
| F033 | F-SEARCH-013 | Tìm kiếm resort theo hạng sao | Cao |
| F034 | F-SEARCH-014 | Hiển thị kết quả tìm kiếm dưới dạng lưới hoặc danh sách | Cao |
| F035 | F-SEARCH-015 | Lọc kết quả tìm kiếm (filter) | Cao |
| F036 | F-SEARCH-016 | Sắp xếp kết quả theo giá, đánh giá, khoảng cách | Cao |
| F037 | F-SEARCH-017 | Phân trang kết quả tìm kiếm | Cao |
| F038 | F-SEARCH-018 | Liên kết đến trang tìm kiếm nâng cao (Advanced Search) | Cao |
| F039 | F-SEARCH-019 | Lưu lịch sử tìm kiếm gần đây | Trung bình |
| F040 | F-SEARCH-020 | Gợi ý tìm kiếm khi người dùng nhập liệu (autocomplete) | Trung bình |

---

### 2.3.3. Trang Tìm kiếm Nâng cao (Advanced Search Page)

| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F041 | F-ADV-001 | Tìm kiếm kết hợp nhiều tiêu chí cùng lúc | Cao |
| F042 | F-ADV-002 | Tìm kiếm theo khoảng cách từ điểm tham quan | Trung bình |
| F043 | F-ADV-003 | Tìm kiếm theo đánh giá của khách (rating) | Cao |
| F044 | F-ADV-004 | Tìm kiếm theo tiện nghi và dịch vụ | Cao |
| F045 | F-ADV-005 | Tìm kiếm theo ngày đặt cụ thể | Trung bình |
| F046 | F-ADV-006 | Tìm kiếm theo số lượng người/lượng phòng | Trung bình |
| F047 | F-ADV-007 | Lưu tiêu chí tìm kiếm để sử dụng lại | Thấp |
| F048 | F-ADV-008 | So sánh các lựa chọn (compare feature) | Thấp |

---

### 2.4. Trang Thông tin (Information Page)

#### 2.4.1. Mô tả chức năng
Trang thông tin tổng hợp các liên kết đến 5 trang thông tin chi tiết và hiển thị thông tin về các khuyến mãi, gói tour hiện có.

#### 2.4.2. Các yêu cầu cụ thể
| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F049 | F-INFO-001 | Hiển thị menu điều hướng với 5 liên kết phụ | Cao |
| F050 | F-INFO-002 | Hiển thị thông tin về các khuyến mãi hiện có | Cao |
| F051 | F-INFO-003 | Hiển thị thông tin về các gói tour đang được giảm giá | Cao |
| F052 | F-INFO-004 | Hiển thị thông tin về các gói tour mới | Cao |
| F053 | F-INFO-005 | Cập nhật thông tin khuyến mãi theo thời gian thực | Trung bình |
| F054 | F-INFO-006 | Hiển thị countdown timer cho các khuyến mãi có thời hạn | Trung bình |
| F055 | F-INFO-007 | Liên kết đến trang chi tiết từng loại thông tin | Cao |

---

### 2.4.3. Trang Thông tin Điểm du lịch (Tourist Spots)

| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F056 | F-SPOT-001 | Hiển thị danh sách tất cả các điểm du lịch trong nước | Cao |
| F057 | F-SPOT-002 | Phân loại điểm du lịch theo vùng miền (Bắc, Trung, Nam) | Cao |
| F058 | F-SPOT-003 | Phân loại điểm du lịch theo loại (bãi biển, núi, di tích, thác nước...) | Cao |
| F059 | F-SPOT-004 | Hiển thị hình ảnh của từng điểm du lịch | Cao |
| F060 | F-SPOT-005 | Hiển thị mô tả ngắn về từng điểm du lịch | Cao |
| F061 | F-SPOT-006 | Hiển thị các hoạt động có thể thực hiện tại điểm du lịch | Cao |
| F062 | F-SPOT-007 | Hiển thị thời điểm tốt nhất để tham quan | Trung bình |
| F063 | F-SPOT-008 | Hiển thị thông tin vé vào cổng (nếu có) | Trung bình |
| F064 | F-SPOT-009 | Hiển thị các khách sạn/nhà hàng gần điểm du lịch | Trung bình |
| F065 | F-SPOT-010 | Có nút đặt tour đến điểm du lịch | Cao |
| F066 | F-SPOT-011 | Tìm kiếm và lọc điểm du lịch | Cao |
| F067 | F-SPOT-012 | Hiển thị đánh giá từ khách du lịch | Trung bình |

---

### 2.4.4. Trang Thông tin Du lịch (Travel Information)

| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F068 | F-TRAVEL-001 | Hiển thị danh sách các phương tiện vận chuyển trong nước | Cao |
| F069 | F-TRAVEL-002 | Thông tin về chuyến bay nội địa (đường bay, hãng hàng không, giá vé) | Cao |
| F070 | F-TRAVEL-003 | Thông tin về xe khách liên tỉnh (tuyến, nhà xe, giá vé, lịch trình) | Cao |
| F071 | F-TRAVEL-004 | Thông tin về tàu hỏa (tuyến, ga, giá vé, lịch trình) | Trung bình |
| F072 | F-TRAVEL-005 | Thông tin về thuê xe du lịch (loại xe, giá thuê, điều kiện) | Cao |
| F073 | F-TRAVEL-006 | Thông tin về xe limousine/dịch vụ cao cấp | Cao |
| F074 | F-TRAVEL-007 | Hiển thị so sánh giữa các phương tiện | Trung bình |
| F075 | F-TRAVEL-008 | Hiển thị thời gian di chuyển trung bình | Trung bình |
| F076 | F-TRAVEL-009 | Có nút đặt vé/đặt dịch vụ vận chuyển | Cao |
| F077 | F-TRAVEL-010 | Tìm kiếm vận chuyển theo tuyến đường | Cao |

---

### 2.4.5. Trang Thông tin Khách sạn (Hotel Information)

| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F078 | F-HOTEL-001 | Hiển thị danh sách tất cả các khách sạn trong nước | Cao |
| F079 | F-HOTEL-002 | Lọc khách sạn theo vị trí (tỉnh/thành phố) | Cao |
| F080 | F-HOTEL-003 | Lọc khách sạn theo hạng sao (1-5 sao) | Cao |
| F081 | F-HOTEL-004 | Lọc khách sạn theo mức giá | Cao |
| F082 | F-HOTEL-005 | Lọc khách sạn theo tiện nghi (wifi, bể bơi, nhà hàng, spa...) | Cao |
| F083 | F-HOTEL-006 | Hiển thị hình ảnh khách sạn (gallery) | Cao |
| F084 | F-HOTEL-007 | Hiển thị mô tả chi tiết về khách sạn | Cao |
| F085 | F-HOTEL-008 | Hiển thị thông tin các loại phòng và giá | Cao |
| F086 | F-HOTEL-009 | Hiển thị tình trạng phòng trống theo ngày | Cao |
| F087 | F-HOTEL-010 | Hiển thị đánh giá từ khách đã ở | Cao |
| F088 | F-HOTEL-011 | Hiển thị vị trí trên bản đồ | Cao |
| F089 | F-HOTEL-012 | Hiển thị các tiện ích xung quanh (nhà hàng, siêu thị, bệnh viện) | Trung bình |
| F090 | F-HOTEL-013 | Có nút đặt phòng trực tiếp | Cao |
| F091 | F-HOTEL-014 | Hiển thị chính sách hủy phòng | Cao |
| F092 | F-HOTEL-015 | Hiển thị thông tin liên hệ khách sạn | Cao |

---

### 2.4.6. Trang Thông tin Nhà hàng (Restaurant Information)

| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F093 | F-RESTAURANT-001 | Hiển thị danh sách các nhà hàng trong nước | Cao |
| F094 | F-RESTAURANT-002 | Lọc nhà hàng theo vị trí (tỉnh/thành phố) | Cao |
| F095 | F-RESTAURANT-003 | Lọc nhà hàng theo loại ẩm thực (Việt, Trung, Nhật, Hàn, Ý, hải sản...) | Cao |
| F096 | F-RESTAURANT-004 | Lọc nhà hàng theo mức giá (bình dân, trung cấp, cao cấp) | Cao |
| F097 | F-RESTAURANT-005 | Lọc nhà hàng theo phong cách (quán ăn, nhà hàng, cafe, bar...) | Trung bình |
| F098 | F-RESTAURANT-006 | Hiển thị hình ảnh nhà hàng/món ăn | Cao |
| F099 | F-RESTAURANT-007 | Hiển thị menu và giá món ăn | Cao |
| F100 | F-RESTAURANT-008 | Hiển thị thông tin đặt bàn | Cao |
| F101 | F-RESTAURANT-009 | Hiển thị giờ mở cửa và đóng cửa | Cao |
| F102 | F-RESTAURANT-010 | Hiển thị đánh giá từ thực khách | Cao |
| F103 | F-RESTAURANT-011 | Hiển thị vị trí trên bản đồ | Cao |
| F104 | F-RESTAURANT-012 | Có nút đặt bàn/đặt món trực tuyến | Cao |
| F105 | F-RESTAURANT-013 | Hiển thị các ưu đãi/khuyến mãi của nhà hàng | Trung bình |

---

### 2.4.7. Trang Thông tin Resort (Resort Information)

| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F106 | F-RESORT-001 | Hiển thị danh sách các resort trong nước | Cao |
| F107 | F-RESORT-002 | Lọc resort theo vị trí (biển, núi, hồ, đảo...) | Cao |
| F108 | F-RESORT-003 | Lọc resort theo hạng sao | Cao |
| F109 | F-RESORT-004 | Lọc resort theo mức giá | Cao |
| F110 | F-RESORT-005 | Lọc resort theo loại hình (biển, núi, sinh thái, spa...) | Cao |
| F111 | F-RESORT-006 | Lọc resort theo tiện nghi (bể bơi, spa, gym, bar, kids club...) | Cao |
| F112 | F-RESORT-007 | Hiển thị hình ảnh resort (gallery) | Cao |
| F113 | F-RESORT-008 | Hiển thị mô tả chi tiết về resort | Cao |
| F114 | F-RESORT-009 | Hiển thị thông tin các loại phòng/bungalow và giá | Cao |
| F115 | F-RESORT-010 | Hiển thị các hoạt động và dịch vụ tại resort | Cao |
| F116 | F-RESORT-011 | Hiển thị tình trạng phòng trống | Cao |
| F117 | F-RESORT-012 | Hiển thị đánh giá từ khách | Cao |
| F118 | F-RESORT-013 | Hiển thị vị trí trên bản đồ | Cao |
| F119 | F-RESORT-014 | Có nút đặt phòng trực tiếp | Cao |
| F120 | F-RESORT-015 | Hiển thị các gói combo (住宿+đi lại+ăn uống) | Cao |

---

### 2.5. Trang Liên hệ (Contact Us)

#### 2.5.1. Mô tả chức năng
Trang liên hệ cho phép khách hàng đặt dịch vụ, gửi yêu cầu tư vấn và phản hồi ý kiến đóng góp.

#### 2.5.2. Các yêu cầu cụ thể
| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F121 | F-CONTACT-001 | Form đặt dịch vụ/tour | Cao |
| F122 | F-CONTACT-002 | Form liên hệ tư vấn | Cao |
| F123 | F-CONTACT-003 | Form gửi phản hồi/đánh giá | Cao |
| F124 | F-CONTACT-004 | Trường nhập liệu: Họ và tên (bắt buộc) | Cao |
| F125 | F-CONTACT-005 | Trường nhập liệu: Địa chỉ email (bắt buộc, có validation) | Cao |
| F126 | F-CONTACT-006 | Trường nhập liệu: Số điện thoại (bắt buộc) | Cao |
| F127 | F-CONTACT-007 | Trường nhập liệu: Địa chỉ | Trung bình |
| F128 | F-CONTACT-008 | Trường nhập liệu: Chọn dịch vụ quan tâm (dropdown) | Cao |
| F129 | F-CONTACT-009 | Trường nhập liệu: Ngày dự kiến | Trung bình |
| F130 | F-CONTACT-010 | Trường nhập liệu: Số lượng người tham gia | Trung bình |
| F131 | F-CONTACT-011 | Trường nhập liệu: Nội dung tin nhắn (textarea) | Cao |
| F132 | F-CONTACT-012 | Trường nhập liệu: Đánh giá (1-5 sao) - dành cho form phản hồi | Cao |
| F133 | F-CONTACT-013 | Trường nhập liệu: Tiêu đề phản hồi | Cao |
| F134 | F-CONTACT-014 | Xác thực form (validation) trước khi gửi | Cao |
| F135 | F-CONTACT-015 | Thông báo xác nhận sau khi gửi form thành công | Cao |
| F136 | F-CONTACT-016 | Hiển thị thông tin liên hệ công ty (địa chỉ, điện thoại, email) | Cao |
| F137 | F-CONTACT-017 | Tích hợp bản đồ hiển thị vị trí công ty | Cao |
| F138 | F-CONTACT-018 | Hiển thị giờ làm việc | Cao |
| F139 | F-CONTACT-019 | Liên kết đến mạng xã hội (Facebook, Zalo, YouTube) | Cao |
| F140 | F-CONTACT-020 | Form gửi yêu cầu gọi lại (callback request) | Trung bình |

---

## 2.6. Trang Quản trị (Admin Panel)

#### 2.6.1. Mô tả chức năng
Trang quản trị (Admin Panel) là nơi để quản lý toàn bộ nội dung và dữ liệu của website. Chỉ có người dùng có quyền quản trị (admin) mới có thể truy cập.

#### 2.6.2. Các yêu cầu cụ thể
| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F141 | F-ADMIN-001 | Đăng nhập admin với email và mật khẩu | Cao |
| F142 | F-ADMIN-002 | Dashboard tổng quan với thống kê (tổng số đơn đặt, doanh thu, lượt truy cập) | Cao |
| F143 | F-ADMIN-003 | Quản lý người dùng (xem, thêm, sửa, xóa) | Cao |
| F144 | F-ADMIN-004 | Quản lý điểm du lịch (CRUD) | Cao |
| F145 | F-ADMIN-005 | Quản lý khách sạn (CRUD) | Cao |
| F146 | F-ADMIN-006 | Quản lý nhà hàng (CRUD) | Cao |
| F147 | F-ADMIN-007 | Quản lý resort (CRUD) | Cao |
| F148 | F-ADMIN-008 | Quản lý phương tiện vận chuyển (CRUD) | Cao |
| F149 | F-ADMIN-009 | Quản lý gói tour (CRUD) | Cao |
| F150 | F-ADMIN-010 | Quản lý khuyến mãi (CRUD) | Cao |
| F151 | F-ADMIN-011 | Quản lý liên hệ/phản hồi từ khách hàng | Cao |
| F152 | F-ADMIN-012 | Quản lý đơn đặt tour/dịch vụ | Cao |
| F153 | F-ADMIN-013 | Quản lý đánh giá của khách hàng | Trung bình |
| F154 | F-ADMIN-014 | Xem báo cáo thống kê doanh thu theo tháng | Cao |
| F155 | F-ADMIN-015 | Xem báo cáo thống kê lượt đặt tour | Cao |
| F156 | F-ADMIN-016 | Xuất báo cáo ra file Excel/PDF | Trung bình |
| F157 | F-ADMIN-017 | Quản lý slider/banner trên trang chủ | Cao |
| F158 | F-ADMIN-018 | Cài đặt thông tin công ty (logo, tên, địa chỉ, liên hệ) | Cao |
| F159 | F-ADMIN-019 | Phân quyền người dùng (admin, moderator, staff) | Cao |
| F160 | F-ADMIN-020 | Đăng xuất admin | Cao |

#### 2.6.3. Trang Dashboard Admin

| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F161 | F-DASH-001 | Hiển thị tổng số điểm du lịch | Cao |
| F162 | F-DASH-002 | Hiển thị tổng số khách sạn | Cao |
| F163 | F-DASH-003 | Hiển thị tổng số nhà hàng | Cao |
| F164 | F-DASH-004 | Hiển thị tổng số resort | Cao |
| F165 | F-DASH-005 | Hiển thị tổng số đơn đặt trong ngày | Cao |
| F166 | F-DASH-006 | Hiển thị tổng doanh thu trong tháng | Cao |
| F167 | F-DASH-007 | Hiển thị danh sách đơn đặt gần đây | Cao |
| F168 | F-DASH-008 | Hiển thị biểu đồ thống kê doanh thu theo tháng | Cao |
| F169 | F-DASH-009 | Hiển thị danh sách liên hệ chưa đọc | Cao |
| F170 | F-DASH-010 | Thông báo khi có đơn đặt mới | Trung bình |

#### 2.6.4. Trang Quản lý Điểm du lịch (Admin Tourist Spots)

| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F171 | F-ASPOT-001 | Danh sách tất cả điểm du lịch | Cao |
| F172 | F-ASPOT-002 | Thêm mới điểm du lịch | Cao |
| F173 | F-ASPOT-003 | Chỉnh sửa thông tin điểm du lịch | Cao |
| F174 | F-ASPOT-004 | Xóa điểm du lịch | Cao |
| F175 | F-ASPOT-005 | Tìm kiếm điểm du lịch | Cao |
| F176 | F-ASPOT-006 | Lọc theo vùng miền | Cao |
| F177 | F-ASPOT-007 | Lọc theo loại hình | Cao |
| F178 | F-ASPOT-008 | Upload nhiều hình ảnh | Cao |
| F179 | F-ASPOT-009 | Xem số lượng đặt tour liên quan | Trung bình |
| F180 | F-ASPOT-010 | Thay đổi trạng thái hiển thị | Cao |

#### 2.6.5. Trang Quản lý Khách sạn (Admin Hotels)

| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F181 | F-AHOTEL-001 | Danh sách tất cả khách sạn | Cao |
| F182 | F-AHOTEL-002 | Thêm mới khách sạn | Cao |
| F183 | F-AHOTEL-003 | Chỉnh sửa thông tin khách sạn | Cao |
| F184 | F-AHOTEL-004 | Xóa khách sạn | Cao |
| F185 | F-AHOTEL-005 | Quản lý các loại phòng của khách sạn | Cao |
| F186 | F-AHOTEL-006 | Quản lý giá phòng theo ngày | Cao |
| F187 | F-AHOTEL-007 | Quản lý tình trạng phòng trống | Cao |
| F188 | F-AHOTEL-008 | Upload gallery hình ảnh | Cao |
| F189 | F-AHOTEL-009 | Thay đổi trạng thái (hoạt động/không hoạt động) | Cao |
| F190 | F-AHOTEL-010 | Xem đánh giá từ khách | Cao |

#### 2.6.6. Trang Quản lý Đơn đặt (Admin Bookings)

| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F191 | F-ABOOK-001 | Danh sách tất cả đơn đặt | Cao |
| F192 | F-ABOOK-002 | Xem chi tiết đơn đặt | Cao |
| F193 | F-ABOOK-003 | Cập nhật trạng thái đơn (chờ xác nhận, đã xác nhận, hoàn thành, hủy) | Cao |
| F194 | F-ABOOK-004 | Lọc đơn theo trạng thái | Cao |
| F195 | F-ABOOK-005 | Lọc đơn theo ngày | Cao |
| F196 | F-ABOOK-006 | Tìm kiếm đơn theo tên khách | Cao |
| F197 | F-ABOOK-007 | Hủy đơn đặt | Cao |
| F198 | F-ABOOK-008 | Gửi email xác nhận cho khách | Cao |
| F199 | F-ABOOK-009 | Xuất danh sách đơn đặt | Trung bình |
| F200 | F-ABOOK-010 | Thống kê doanh thu theo đơn | Cao |

#### 2.6.7. Trang Quản lý Khuyến mãi (Admin Promotions)

| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F201 | F-APROMO-001 | Danh sách tất cả khuyến mãi | Cao |
| F202 | F-APROMO-002 | Thêm mới khuyến mãi | Cao |
| F203 | F-APROMO-003 | Chỉnh sửa khuyến mãi | Cao |
| F204 | F-APROMO-004 | Xóa khuyến mãi | Cao |
| F205 | F-APROMO-005 | Thiết lập ngày bắt đầu và kết thúc | Cao |
| F206 | F-APROMO-006 | Thiết lập mức giảm giá (%) | Cao |
| F207 | F-APROMO-007 | Áp dụng cho tour/khách sạn cụ thể | Cao |
| F208 | F-APROMO-008 | Trạng thái hoạt động/không hoạt động | Cao |
| F209 | F-APROMO-009 | Hiển thị trên trang chủ (show on home) | Cao |
| F210 | F-APROMO-010 | Tự động hết hạn khi đến ngày kết thúc | Cao |

#### 2.6.8. Trang Quản lý Liên hệ (Admin Contacts)

| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F211 | F-ACONTACT-001 | Danh sách tin nhắn liên hệ | Cao |
| F212 | F-ACONTACT-002 | Xem chi tiết tin nhắn | Cao |
| F213 | F-ACONTACT-003 | Đánh dấu đã đọc/chưa đọc | Cao |
| F214 | F-ACONTACT-004 | Trả lời tin nhắn qua email | Cao |
| F215 | F-ACONTACT-005 | Xóa tin nhắn | Cao |
| F216 | F-ACONTACT-006 | Lọc theo trạng thái (đã đọc/chưa đọc) | Cao |
| F217 | F-ACONTACT-007 | Tìm kiếm tin nhắn | Cao |
| F218 | F-ACONTACT-008 | Xuất danh sách liên hệ | Trung bình |

#### 2.6.9. Trang Quản lý Người dùng (Admin Users)

| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F219 | F-AUSER-001 | Danh sách tất cả người dùng | Cao |
| F220 | F-AUSER-002 | Thêm mới người dùng admin | Cao |
| F221 | F-AUSER-003 | Chỉnh sửa thông tin người dùng | Cao |
| F222 | F-AUSER-004 | Xóa người dùng | Cao |
| F223 | F-AUSER-005 | Phân quyền người dùng (admin, moderator, staff) | Cao |
| F224 | F-AUSER-006 | Thay đổi mật khẩu người dùng | Cao |
| F225 | F-AUSER-007 | Kích hoạt/vô hiệu hóa tài khoản | Cao |
| F226 | F-AUSER-008 | Xem lịch sử đơn đặt của người dùng | Cao |

#### 2.6.10. Trang Cài đặt (Admin Settings)

| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F227 | F-ASET-001 | Cập nhật thông tin công ty | Cao |
| F228 | F-ASET-002 | Thay đổi logo | Cao |
| F229 | F-ASET-003 | Cập nhật thông tin liên hệ | Cao |
| F230 | F-ASET-004 | Quản lý các liên kết mạng xã hội | Cao |
| F231 | F-ASET-005 | Quản lý menu điều hướng | Cao |
| F232 | F-ASET-006 | Quản lý banner trang chủ | Cao |
| F233 | F-ASET-007 | Cấu hình email gửi tự động | Trung bình |
| F234 | F-ASET-008 | Sao lưu dữ liệu | Trung bình |

#### 2.6.11. Trang Quản lý Phương tiện (Admin Vehicles/Transports)

| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F235 | F-AVEH-001 | Danh sách tất cả phương tiện vận chuyển | Cao |
| F236 | F-AVEH-002 | Thêm mới phương tiện | Cao |
| F237 | F-AVEH-003 | Chỉnh sửa thông tin phương tiện | Cao |
| F238 | F-AVEH-004 | Xóa phương tiện | Cao |
| F239 | F-AVEH-005 | Quản lý loại phương tiện (xe khách, limousine, máy bay, tàu hỏa) | Cao |
| F240 | F-AVEH-006 | Quản lý tuyến đường | Cao |
| F241 | F-AVEH-007 | Quản lý lịch trình | Cao |
| F242 | F-AVEH-008 | Quản lý giá vé theo tuyến | Cao |
| F243 | F-AVEH-009 | Upload hình ảnh phương tiện | Cao |
| F244 | F-AVEH-010 | Thay đổi trạng thái (hoạt động/không hoạt động) | Cao |
| F245 | F-AVEH-011 | Quản lý nhà xe/hãng vận chuyển | Cao |

#### 2.6.12. Trang Quản lý Tour (Admin Tours)

| STT | Mã yêu cầu | Mô tả yêu cầu | Độ ưu tiên |
|-----|------------|---------------|-------------|
| F246 | F-ATOUR-001 | Danh sách tất cả gói tour | Cao |
| F247 | F-ATOUR-002 | Thêm mới tour | Cao |
| F248 | F-ATOUR-003 | Chỉnh sửa thông tin tour | Cao |
| F249 | F-ATOUR-004 | Xóa tour | Cao |
| F250 | F-ATOUR-005 | Quản lý lịch trình tour chi tiết | Cao |
| F251 | F-ATOUR-006 | Quản lý giá tour theo nhóm | Cao |
| F252 | F-ATOUR-007 | Quản lý ngày khởi hành | Cao |
| F253 | F-ATOUR-008 | Upload gallery hình ảnh tour | Cao |
| F254 | F-ATOUR-009 | Quản lý các điểm đến trong tour | Cao |
| F255 | F-ATOUR-010 | Quản lý dịch vụ bao gồm/ngoại trú | Cao |
| F256 | F-ATOUR-011 | Thay đổi trạng thái (hoạt động/không hoạt động) | Cao |
| F257 | F-ATOUR-012 | Xem số lượng đặt tour | Cao |
| F258 | F-ATOUR-013 | Quản lý hướng dẫn viên du lịch | Trung bình |

---

## 3. CẤU TRÚC MENU

### 3.1. Menu chính (Frontend)

```
- Trang chủ (Home Page)
- Giới thiệu (About Us)
- Tìm kiếm (Search page)
- Thông tin (Information Page)
  ├── Điểm du lịch (Tourist Spots)
  ├── Thông tin Du lịch (Travel Information)
  ├── Thông tin Khách sạn (Hotel Information)
  ├── Thông tin Nhà hàng (Restaurant Information)
  └── Thông tin Resort (Resorts Information)
- Liên hệ (Contact Us)
```

### 3.2. Menu Admin Panel

```
- Dashboard
- Quản lý điểm du lịch
- Quản lý khách sạn
- Quản lý nhà hàng
- Quản lý resort
- Quản lý phương tiện
- Quản lý tour
- Quản lý đơn đặt
- Quản lý khuyến mãi
- Quản lý liên hệ
- Quản lý người dùng
- Cài đặt
- Đăng xuất
```

---

## 4. YÊU CẦU PHI CHỨC NĂNG

### 4.1. Yêu cầu về hiệu năng

| STT | Mã yêu cầu | Mô tả yêu cầu |
|-----|------------|---------------|
| NF001 | Thời gian tải trang chủ không quá 3 giây với đường truyền thông thường |
| NF002 | Thời gian phản hồi khi tìm kiếm không quá 2 giây |
| NF003 | Website phải hỗ trợ đồng thời tối thiểu 100 người dùng |
| NF004 | Hỗ trợ nén Gzip để giảm kích thước tài nguyên |

### 4.2. Yêu cầu về bảo mật

| STT | Mã yêu cầu | Mô tả yêu cầu |
|-----|------------|---------------|
| NF005 | Sử dụng HTTPS cho toàn bộ website |
| NF006 | Mã hóa mật khẩu nếu có hệ thống đăng nhập |
| NF007 | Bảo vệ chống SQL Injection và XSS |
| NF008 | Validate và sanitize tất cả dữ liệu đầu vào từ form |

### 4.3. Yêu cầu về khả dụng

| STT | Mã yêu cầu | Mô tả yêu cầu |
|-----|------------|---------------|
| NF009 | Giao diện thân thiện, dễ sử dụng |
| NF010 | Điều hướng rõ ràng, nhất quán |
| NF011 | Thông báo lỗi rõ ràng và hữu ích |
| NF012 | Hỗ trợ keyboard navigation |

### 4.4. Yêu cầu về tương thích

| STT | Mã yêu cầu | Mô tả yêu cầu |
|-----|------------|---------------|
| NF013 | Tương thích với các trình duyệt hiện đại (Chrome, Firefox, Safari, Edge) |
| NF014 | Responsive design - hiển thị tốt trên Desktop, Tablet, Mobile |
| NF015 | Hỗ trợ độ phân giải từ 320px đến 1920px |

### 4.5. Yêu cầu về SEO

| STT | Mã yêu cầu | Mô tả yêu cầu |
|-----|------------|---------------|
| NF016 | Sử dụng URL thân thiện (friendly URL) |
| NF017 | Có meta title và meta description cho mỗi trang |
| NF018 | Sử dụng cấu trúc HTML semantic |
| NF019 | Tối ưu hình ảnh với alt text |

### 4.6. Yêu cầu về khả năng bảo trì

| STT | Mã yêu cầu | Mô tả yêu cầu |
|-----|------------|---------------|
| NF020 | Mã nguồn rõ ràng, có comment khi cần thiết |
| NF021 | Tách biệt rõ ràng giữa frontend và backend |
| NF022 | Có tài liệu hướng dẫn cài đặt và sử dụng |

---

## 5. YÊU CẦU VỀ DỮ LIỆU

### 5.1. Các thực thể chính

1. **Người dùng (User)**
   - ID, tên, email, mật khẩu (đã mã hóa), vai trò (admin, moderator, staff), trạng thái, ngày tạo

2. **Điểm du lịch (TouristSpot)**
   - ID, tên, mô tả, hình ảnh, vị trí, loại hình, đánh giá

3. **Khách sạn (Hotel)**
   - ID, tên, địa chỉ, hạng sao, giá phòng, tiện nghi, hình ảnh

4. **Nhà hàng (Restaurant)**
   - ID, tên, địa chỉ, loại ẩm thực, mức giá, giờ mở cửa, hình ảnh

5. **Resort**
   - ID, tên, địa chỉ, loại hình, hạng sao, tiện nghi, giá, hình ảnh

6. **Phương tiện vận chuyển (Transport)**
   - ID, loại phương tiện, tuyến đường, giá vé, lịch trình

7. **Gói tour (TourPackage)**
   - ID, tên, mô tả, giá, thời gian, điểm đến

8. **Khuyến mãi (Promotion)**
   - ID, tên, mô tả, giảm giá, ngày bắt đầu, ngày kết thúc

9. **Đơn đặt (Booking)**
   - ID, người dùng, tour/khách sạn, ngày đặt, trạng thái, tổng tiền

10. **Liên hệ/Phản hồi (Contact)**
    - ID, tên khách, email, điện thoại, nội dung, ngày gửi, trạng thái đã đọc

---

## 6. PHỤ LỤC

### 6.1. Từ viết tắt

| Từ viết tắt | Giải nghĩa |
|-------------|------------|
| SRS | Software Requirements Specification |
| UI | User Interface |
| UX | User Experience |
| SEO | Search Engine Optimization |
| HTTPS | Hypertext Transfer Protocol Secure |
| URL | Uniform Resource Locator |
| SQL | Structured Query Language |
| XSS | Cross-Site Scripting |

### 6.2. Tài liệu tham khảo

- Yêu cầu khách hàng ban đầu (Customer Requirement Specification)
- Các tiêu chuẩn UX/UI hiện đại

---

**Người lập:** [Tên người lập]

**Ngày phê duyệt:** [Ngày phê duyệt]

**Chữ ký:** ____________________

---

*Lưu ý: Tài liệu này sẽ được cập nhật khi có thay đổi về yêu cầu từ phía khách hàng.*
