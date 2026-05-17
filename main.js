document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. HAMBURGER MENU MOBILE
  // ==========================================================================
  const menuBtn = document.getElementById('menu-btn');
  const navLinksContainer = document.querySelector('.nav-links');

  if (menuBtn && navLinksContainer) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Tránh sự kiện nổi bọt
      navLinksContainer.classList.toggle('open');
    });

    // Bấm ra ngoài menu thì tự động đóng menu lại
    document.addEventListener('click', (e) => {
      if (!navLinksContainer.contains(e.target) && !menuBtn.contains(e.target)) {
        navLinksContainer.classList.remove('open');
      }
    });
  }

  // ==========================================================================
  // 2. ACTIVE NAV LINK (Đánh dấu menu trang hiện tại)
  // ==========================================================================
  const allLinks = document.querySelectorAll('.nav-links a');
  const currentUrl = window.location.href;

  allLinks.forEach(link => {
    // So sánh đường dẫn link với URL thanh địa chỉ trình duyệt
    if (link.href === currentUrl || currentUrl.includes(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });

  // ==========================================================================
  // 3. SMOOTH SCROLL (Cuộn mượt cho các thẻ có href bắt đầu bằng dấu #)
  // ==========================================================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Nếu chỉ có mỗi dấu '#' thì bỏ qua
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault(); // Chặn hành vi nhảy trang đột ngột mặc định
        
        // Đóng menu mobile nếu đang mở trước khi cuộn
        if (navLinksContainer) navLinksContainer.classList.remove('open');

        // Thực hiện cuộn mượt đến đích
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ==========================================================================
  // 4. SCROLL REVEAL (Hiệu ứng xuất hiện khi cuộn trang)
  // ==========================================================================
  // Thiết lập cấu hình bộ quan sát
  const revealOptions = {
    root: null,          // Lấy viewport của trình duyệt làm chuẩn
    threshold: 0.15,     // Kích hoạt khi phần tử lộ diện 15% diện tích
    rootMargin: "0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // Nếu phần tử đi vào vùng nhìn thấy
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Hủy quan sát sau khi đã hiển thị xong (chỉ chạy 1 lần)
      }
    });
  }, revealOptions);

  // Tìm tất cả các phần tử có class .reveal để đưa vào danh sách quan sát
  const elementsToReveal = document.querySelectorAll('.reveal');
  elementsToReveal.forEach(el => revealObserver.observe(el));

});