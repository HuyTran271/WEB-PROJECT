# Giải thích CSS (`css/styles.css`)

File CSS một lớp, không preprocessor. Các khối chính theo thứ tự trong file.

## 1. Tiện ích & layout trang

- **`.visually-hidden`:** ẩn visually nhưng vẫn đọc được bởi trình đọc màn hình (nhãn input).
- **`body[data-page]:not([data-page='home']) main`:** `padding-top: 86px` – tránh nội dung bị navbar che (trang chủ hero full màn hình không cần).
- **`body[data-page='map']`:** tăng chiều cao `#map-wrap` để Leaflet tính đúng kích thước tile.

## 2. Reset & biến (`:root`)

| Biến | Ý nghĩa |
|------|---------|
| `--g1`, `--g2`, `--g3` | Xanh lá đậm → nhạt (thương hiệu rừng) |
| `--sage`, `--mint` | Xanh phụ, nhấn nhẹ |
| `--cream`, `--cream2` | Nền kem ấm |
| `--amber`, `--amber2` | CTA nút vàng cam |
| `--text`, `--text2` | Chữ chính / phụ |
| `--shad`, `--shad-sm` | Đổ bóng card |
| `--r`, `--r2` | Bo góc 12px / 20px |
| `--t` | Transition 0,3s easing |

`box-sizing: border-box` toàn cục giúp tính width/padding nhất quán.

## 3. Navbar (`#nav`)

- `position: fixed` – luôn trên cùng, `z-index: 900`.
- **`.solid`:** nền xanh đục + blur khi đã cuộn (JS toggle).
- **`.nav-in`:** flex, max-width 1300px, cao 70px.
- **`.nav-links a.act`:** mục menu hiện tại (trang riêng, không dùng hash).
- **`.nav-search`:** ô tìm bo tròn; `#sdrop` dropdown trắng dưới input.
- **`#mob-menu`:** panel full màn hình mobile; `.open` hiển thị (ẩn mặc định trên desktop).

## 4. Hero (`#hero`)

- Full viewport; slide `.hs` chồng absolute, chỉ `.hs.on` hiện (`opacity`/`z-index`).
- **`.hero-cnt`:** chữ trắng trên overlay gradient (đọc được trên SVG).
- **`.hero-stats`:** thanh số liệu dưới cùng; `.stat-n` font lớn (số đếm bằng JS).
- **`.hdot`:** nút chấm slide; `.on` nổi bật.

## 5. Section chung (`.sec`, `.wrap`)

- `.sec`: padding dọc 5rem; `.wrap`: căn giữa max 1300px.
- **`.sec-hd`:** tiêu đề section căn giữa.
- **`.sec-tag`:** pill nhãn nhỏ chữ hoa.
- **`[data-rv]`:** ban đầu mờ/dịch (trong CSS); JS thêm `.vis` khi scroll tới.

## 6. Featured & destination cards

- **`.feat-grid`:** grid 2 cột – 1 thẻ lớn + 2 nhỏ.
- **`.fc`:** thẻ gradient, hover phóng nhẹ; cursor pointer.
- **`.dgrid` / `.dcard`:** lưới điểm đến; ảnh emoji `.dcard-emo`, nút yêu thích `.dcard-fav.on`.

## 7. Bản đồ (`#map-sec`, `#map-wrap`, `#lmap`)

- Section nền `--g1` (tối) – chữ `.sec-h2` màu `--mint`.
- **`#map-wrap`:** `height: 520px` (desktop); `position: relative` cho panel lọc.
- **`#lmap`:** `height/width 100%` – Leaflet chiếm hết wrap.
- **`.mfp`:** panel lọc absolute góc trái trên bản đồ.
- **`.mfb.on`:** nút lọc đang chọn.
- Popup Leaflet: class `.lpop` (trong JS `bindPopup`).

## 8. Guide & FAQ

- **`.guide-grid`:** 2 cột desktop, 1 cột mobile.
- **`.tip`:** flex icon + text; màu icon theo `.tip-ico.gr|am|bl|ro`.
- **`.cost-tbl`:** bảng viền nhẹ, header nền xanh nhạt.
- **`.faq-item.open .faq-a`:** mở accordion (chiều cao / hiển thị trong CSS).

## 9. Newsletter (`#newsletter`)

- Nền tối gradient; form `.nl-form` flex column.
- **`.nli.err`:** viền đỏ khi validate fail.
- **`.nl-msg.ok` / `.er`:** thông báo thành công / lỗi.

## 10. Modal (`#modal`)

- `display: none` mặc định; **`.open`** → `display: flex` căn giữa overlay.
- **`.mbox`:** card trắng max 880px; **`.mgal`:** vùng gallery; **`.mslide.on`** slide hiện.
- **`#mmap`:** chiều cao cố định cho mini map trong modal.

## 11. Footer

- **`.ft-top`:** grid 4 cột (brand + 3 cột link).
- **`.ft-bot`:** dòng copyright tối hơn.

## 12. Responsive (`@media`)

- **900px:** ẩn `.nav-links` & search desktop; hiện hamburger; 1 cột footer / guide.
- **600px:** map thấp hơn (380px); ẩn `.mfp` trên mobile (chỉ xem map + popup marker).
- **480px:** giảm padding section, cỡ chữ hero.

## Mẹo bảo trì

- Đổi palette: sửa `:root` trước, tránh hard-code màu rải rác.
- Thêm trang mới: thêm `data-page` và nhánh trong `script.js`; không cần CSS riêng nếu dùng class `.sec` có sẵn.
