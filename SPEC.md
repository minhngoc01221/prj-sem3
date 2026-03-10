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

## 3. CẤU TRÚC MENU

### 3.1. Menu chính

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

1. **Điểm du lịch (TouristSpot)**
   - ID, tên, mô tả, hình ảnh, vị trí, loại hình, đánh giá

2. **Khách sạn (Hotel)**
   - ID, tên, địa chỉ, hạng sao, giá phòng, tiện nghi, hình ảnh

3. **Nhà hàng (Restaurant)**
   - ID, tên, địa chỉ, loại ẩm thực, mức giá, giờ mở cửa, hình ảnh

4. **Resort**
   - ID, tên, địa chỉ, loại hình, hạng sao, tiện nghi, giá, hình ảnh

5. **Phương tiện vận chuyển (Transport)**
   - ID, loại phương tiện, tuyến đường, giá vé, lịch trình

6. **Gói tour (TourPackage)**
   - ID, tên, mô tả, giá, thời gian, điểm đến

7. **Khuyến mãi (Promotion)**
   - ID, tên, mô tả, giảm giá, ngày bắt đầu, ngày kết thúc

8. **Liên hệ/Phản hồi (Contact)**
   - ID, tên khách, email, điện thoại, nội dung, ngày gửi

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
