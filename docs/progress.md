# Tiến độ dự án

## Đã hoàn thành

- Tách 5 trang HTML: `index`, `destination`, `map`, `guide`, `contact`
- Gộp navbar thành một partial `html/partials/nav.html` (xóa 4 partial cũ)
- Footer & modal dùng chung qua partial
- Chuyển logic sang **jQuery** (`script.js`, `include.js`)
- Tách dữ liệu `DESTS` → `js/data.js`
- **Sửa bản đồ:** khởi tạo ngay trên `map.html` + `invalidateSize()`
- HTML semantic & accessibility (label ẩn, `aria-*`, `button` thay `div` click)
- Tài liệu: `docs/architecture.md` (chức năng), `docs/css-guide.md` (giải thích CSS)

## Kiểm tra

1. Chạy server tĩnh trong thư mục `html/`
2. `map.html` – bản đồ hiển thị tile, click marker, lọc danh mục
3. `destination.html` – lưới thẻ, modal mini map
4. `index.html` – hero slide, thẻ nổi bật mở modal
5. `contact.html` – form validate & toast

## Gợi ý sau này

- Backend API cho form newsletter
- Ảnh thật thay emoji trong gallery
- Build Vite + template SSI thay AJAX sync partial
