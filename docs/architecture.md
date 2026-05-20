# Kiến trúc dự án – Du lịch Sinh thái Đắk Lắk

## Cấu trúc thư mục

| Thư mục / file | Vai trò |
|----------------|---------|
| `html/index.html` | Trang chủ: hero, điểm nổi bật |
| `html/destination.html` | Danh sách & lọc điểm đến |
| `html/map.html` | Bản đồ Leaflet toàn màn hình |
| `html/guide.html` | Cẩm nang, bảng chi phí, FAQ |
| `html/contact.html` | Liên hệ & đăng ký bản tin |
| `html/partials/nav.html` | Navbar + menu mobile (một file) |
| `html/partials/footer.html` | Chân trang dùng chung |
| `html/partials/modal.html` | Hộp thoại chi tiết điểm đến |
| `js/include.js` | Nạp partial (jQuery AJAX đồng bộ) |
| `js/data.js` | Mảng `DESTS` – dữ liệu điểm đến |
| `js/script.js` | Logic UI theo `data-page` trên `<body>` |
| `css/styles.css` | Toàn bộ giao diện |

## Công nghệ

- **HTML semantic:** `header`, `main`, `section`, `article`, `nav`, `footer`, `aside`
- **jQuery 3.7** – sự kiện, DOM, animation scroll
- **Leaflet 1.9** – bản đồ OpenStreetMap
- Không build tool; mở qua server tĩnh (Live Server, `npx serve`, v.v.)

## Khởi tạo theo trang

Thuộc tính `data-page` trên `<body>` quyết định module nào chạy:

| `data-page` | Chức năng bật |
|-------------|----------------|
| `home` | Slideshow hero, đếm số thống kê, thẻ nổi bật → modal |
| `dest` | Lưới thẻ, tìm kiếm, lọc danh mục, modal |
| `map` | Khởi tạo bản đồ **ngay** + `invalidateSize()` (sửa lỗi chia trang) |
| `guide` | Accordion FAQ |
| `contact` | Form đăng ký bản tin (validate phía client) |

Navbar, nút về đầu, toast, tìm kiếm nav chạy trên mọi trang.

## Chức năng chi tiết

### 1. Navbar (`partials/nav.html` + `initCommon`)

- Cố định trên cùng; thêm lớp `.solid` khi cuộn > 60px.
- Link active theo `data-nav` khớp `data-page` (không còn anchor `#section` giữa các trang).
- **Tìm kiếm nav:** gõ tên → dropdown tối đa 4 gợi ý từ `DESTS` → click mở modal (trang có modal) hoặc cần sang trang có modal.
- **Menu mobile (`#ham`):** bật `#mob-menu`, cập nhật `aria-expanded`.

### 2. Trang chủ – Hero

- 3 slide SVG tự động đổi mỗi 5,5s; nút chấm chọn slide.
- **Thống kê:** khi vào viewport, số chạy từ 0 đến `data-target` (định dạng `vi-VN`).
- CTA dẫn tới `destination.html` và `map.html`.

### 3. Trang chủ – Điểm nổi bật

- 3 thẻ lớn/nhỏ; click hoặc Enter/Space mở **modal** chi tiết (`data-id`).

### 4. Điểm đến (`destination.html`)

- **`renderCards()`:** render từ `DESTS`, lọc `data-cat`, tìm `#dest-search`.
- Mỗi thẻ: yêu thích (toast), nút chi tiết, click thẻ → modal.
- Modal: gallery emoji, meta (giá, mùa, thời lượng), danh sách highlight, **mini map Leaflet** tại tọa độ điểm.

### 5. Bản đồ (`map.html`)

- **Vấn đề cũ:** `script.js` gọi `getElementById('dgrid')`, hero, v.v. → lỗi JS → map không chạy.
- **Cách sửa:** chỉ `initMap(true)` khi `data-page="map"`; gọi `lmap.invalidateSize()` sau layout (container có chiều cao cố định).
- Marker màu theo danh mục; popup có nút “Xem chi tiết” → modal.
- Panel `.mfp`: lọc marker theo tag (rừng, hồ, thác…).

### 6. Hướng dẫn (`guide.html`)

- Mẹo du lịch dạng thẻ; bảng chi phí có `<caption>` ẩn cho screen reader.
- **FAQ:** một mục mở tại một thời điểm; nút `<button class="faq-q">` với `aria-expanded`.

### 7. Liên hệ (`contact.html`)

- Form: họ tên, email bắt buộc, checkbox đồng ý.
- Validate regex email; hiển thị `#nl-msg`; giả lập gửi 1,2s (chưa có backend).

### 8. Tiện ích chung

- **Toast** `#toast`: thông báo ngắn 3s.
- **Back to top** `#btt`: hiện khi cuộn > 400px.
- **Scroll reveal** `[data-rv]`: thêm class `.vis` khi vào viewport.
- **Modal:** Escape đóng; click nền đóng; `aria-modal` + `hidden` khi đóng.

## Chạy local

```bash
cd html
npx --yes serve -p 3000
```

Mở `http://localhost:3000/index.html`. Cần internet cho jQuery CDN, Leaflet và tile map.

## Giải thích CSS

Xem file **`docs/css-guide.md`** – mô tả biến màu, navbar, hero, section, map, modal và responsive.
