/* Tương tác chính – jQuery, khởi tạo theo data-page trên body */
(function ($) {
  var page = $('body').data('page') || 'home';
  var mapReady = false;
  var lmap = null;
  var mmarkers = [];
  var miniMap = null;
  var gi = 0;
  var activeCat = 'all';
  var searchQ = '';
  var hi = 0;
  var toastTimer;

  var catBg = {
    rung: 'linear-gradient(135deg,#0d2518,#1a4a2d)',
    ho: 'linear-gradient(135deg,#0a1f2e,#1a3d5a)',
    thac: 'linear-gradient(135deg,#0a2030,#1a4a6a)',
    thanhPho: 'linear-gradient(135deg,#1a1a0a,#3a3010)',
    sinhThai: 'linear-gradient(135deg,#1a280a,#2a4a18)',
    vanHoa: 'linear-gradient(135deg,#1a0a28,#3a1a4a)'
  };

  var catC = {
    rung: '#2d5a3d',
    ho: '#1e40af',
    thac: '#0891b2',
    thanhPho: '#d97706',
    sinhThai: '#65a30d',
    vanHoa: '#7c3aed'
  };

  function bgFor(cat) {
    return catBg[cat] || 'linear-gradient(135deg,#1a3828,#2d5a3d)';
  }

  function starStr(r) {
    return '★'.repeat(Math.floor(r)) + (r % 1 ? '½' : '');
  }

  function toast(msg) {
    var $t = $('#toast');
    $t.text(msg).addClass('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      $t.removeClass('show');
    }, 3000);
  }

  /* ─── Chung: navbar, scroll, BTT ─── */
  function observeReveal($els) {
    $els.each(function () {
      var el = this;
      if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) {
                $(e.target).addClass('vis');
                obs.unobserve(e.target);
              }
            });
          },
          { threshold: 0.08 }
        );
        obs.observe(el);
      } else {
        $(el).addClass('vis');
      }
    });
  }

  function initCommon() {
    var current = page;
    if (page !== 'home') $('#nav').addClass('solid');
    $('.nav-links a[data-nav="' + current + '"], #mob-menu a[data-nav="' + current + '"]').addClass('act');

    $(window).on('scroll', function () {
      var sc = $(window).scrollTop();
      $('#nav').toggleClass('solid', sc > 60);
      $('#btt').toggleClass('show', sc > 400);
    });

    $('#btt').on('click', function () {
      $('html, body').animate({ scrollTop: 0 }, 400);
    });

    $('#ham').on('click', function () {
      var open = $('#mob-menu').toggleClass('open').hasClass('open');
      $(this).attr('aria-expanded', open);
    });

    observeReveal($('[data-rv]'));
    initNavSearch();
  }

  function initNavSearch() {
    $('#nsearch').on('input', function () {
      var q = $(this).val().trim().toLowerCase();
      var $drop = $('#sdrop').empty();
      if (!q) {
        $drop.hide();
        return;
      }
      var hits = DESTS.filter(function (d) {
        return d.name.toLowerCase().includes(q) || d.catL.toLowerCase().includes(q);
      }).slice(0, 4);
      if (!hits.length) {
        $drop.hide();
        return;
      }
      hits.forEach(function (d) {
        var $item = $('<div class="sdi" role="option"></div>');
        $item.html(
          '<div class="sdi-emo" style="background:' +
            bgFor(d.cat) +
            '">' +
            d.emo +
            '</div><div class="sdi-info"><span>' +
            d.name +
            '</span><small>' +
            d.catL +
            '</small></div>'
        );
        $item.on('click', function () {
          $drop.hide();
          $('#nsearch').val('');
          openModal(d.id);
        });
        $drop.append($item);
      });
      $drop.show();
    });

    $(document).on('click', function (e) {
      if (!$(e.target).closest('.nav-search').length) $('#sdrop').hide();
    });
  }

  /* ─── Trang chủ: hero, thống kê ─── */
  function initHome() {
    var $slides = $('.hs');
    var $dots = $('.hdot');

    function goHero(n) {
      $slides.eq(hi).removeClass('on');
      $dots.eq(hi).removeClass('on');
      hi = (n + $slides.length) % $slides.length;
      $slides.eq(hi).addClass('on');
      $dots.eq(hi).addClass('on');
    }

    $dots.each(function (i) {
      $(this).on('click', function () {
        goHero(i);
      });
    });
    setInterval(function () {
      goHero(hi + 1);
    }, 5500);

    $('[data-target]').each(function () {
      var el = this;
      var obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            var $el = $(el);
            var target = parseInt($el.data('target'), 10);
            var suf = $el.data('suffix') || '';
            var dur = 1800;
            var steps = dur / 16;
            var cur = 0;
            var t = setInterval(function () {
              cur = Math.min(cur + target / steps, target);
              $el.text(Math.floor(cur).toLocaleString('vi-VN') + suf);
              if (cur >= target) clearInterval(t);
            }, 16);
            obs.unobserve(el);
          });
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
    });

    $('.fc[data-id]').on('click keypress', function (e) {
      if (e.type === 'keypress' && e.which !== 13 && e.which !== 32) return;
      openModal(parseInt($(this).data('id'), 10));
    });
  }

  /* ─── Điểm đến: lưới thẻ ─── */
  function initDest() {
    renderCards();
    $('.fb').on('click', function () {
      $('.fb').removeClass('on');
      $(this).addClass('on');
      activeCat = $(this).data('cat');
      renderCards();
    });
    $('#dest-search').on('input', function () {
      searchQ = $(this).val().trim();
      renderCards();
    });
  }

  function renderCards() {
    var $g = $('#dgrid');
    if (!$g.length) return;
    if (typeof DESTS === 'undefined' || !DESTS.length) {
      $g.html('<p class="no-results">Không tải được dữ liệu điểm đến.</p>');
      return;
    }

    var list = DESTS;
    if (activeCat !== 'all') {
      list = list.filter(function (d) {
        return d.tags.indexOf(activeCat) !== -1;
      });
    }
    if (searchQ) {
      var q = searchQ.toLowerCase();
      list = list.filter(function (d) {
        return (
          d.name.toLowerCase().includes(q) ||
          d.desc.toLowerCase().includes(q) ||
          d.loc.toLowerCase().includes(q)
        );
      });
    }

    $g.empty();
    if (!list.length) {
      $g.html('<p class="no-results">Không tìm thấy điểm đến phù hợp.</p>');
      return;
    }

    list.forEach(function (d, i) {
      var $el = $('<article class="dcard" tabindex="0"></article>');
      $el.attr({ 'data-id': d.id });
      $el.html(
        '<div class="dcard-img"><div class="dcard-emo" style="background:' +
          bgFor(d.cat) +
          '">' +
          d.emo +
          '</div><span class="dcard-cat">' +
          d.catL +
          '</span><button type="button" class="dcard-fav" data-id="' +
          d.id +
          '" aria-label="Yêu thích">♡</button></div><div class="dcard-body"><p class="dcard-meta"><span>' +
          d.loc +
          '</span><span> · </span><span>' +
          d.dur +
          '</span></p><h3 class="dcard-h3">' +
          d.name +
          '</h3><p class="dcard-p">' +
          d.desc +
          '</p><div class="dcard-foot"><div class="rating"><span class="stars">' +
          starStr(d.rating) +
          '</span><span>' +
          d.rating +
          '</span></div><button type="button" class="btn btn-green btn-sm det-btn" data-id="' +
          d.id +
          '">Chi tiết</button></div></div>'
      );

      $el.find('.dcard-fav').on('click', function (e) {
        e.stopPropagation();
        var on = $(this).toggleClass('on').hasClass('on');
        $(this).text(on ? '♥' : '♡');
        toast(on ? 'Đã thêm yêu thích' : 'Đã bỏ yêu thích');
      });
      $el.find('.det-btn').on('click', function (e) {
        e.stopPropagation();
        openModal(d.id);
      });
      $el.on('click keypress', function (e) {
        if (e.type === 'keypress' && e.which !== 13 && e.which !== 32) return;
        if ($(e.target).closest('.dcard-fav, .det-btn').length) return;
        openModal(d.id);
      });

      $g.append($el);
    });
    observeReveal($g.find('.dcard'));
  }

  /* ─── Bản đồ Leaflet ─── */
  function initMap(immediate) {
    if (mapReady || !$('#lmap').length || typeof L === 'undefined') return;
    mapReady = true;

    lmap = L.map('lmap', { scrollWheelZoom: true }).setView([12.67, 108.05], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18
    }).addTo(lmap);

    DESTS.forEach(function (d) {
      var c = catC[d.cat] || '#1a3828';
      var icon = L.divIcon({
        html:
          '<div style="width:42px;height:42px;background:' +
          c +
          ';border-radius:50% 50% 50% 2px;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 3px 12px rgba(0,0,0,.25)"><span style="transform:rotate(45deg);font-size:1.1rem">' +
          d.emo +
          '</span></div>',
        className: '',
        iconSize: [42, 42],
        iconAnchor: [21, 42],
        popupAnchor: [0, -44]
      });
      var m = L.marker([d.lat, d.lng], { icon: icon }).addTo(lmap);
      m.bindPopup(
        '<div class="pop-in"><p class="pcat">' +
          d.catL +
          '</p><h3>' +
          d.name +
          '</h3><p>' +
          d.desc.slice(0, 85) +
          '…</p><p class="pmeta"><span>★ ' +
          d.rating +
          '</span></p><button type="button" class="pop-btn" data-pop-id="' +
          d.id +
          '">Xem chi tiết</button></div>',
        { className: 'lpop', maxWidth: 240 }
      );
      mmarkers.push({ m: m, d: d });
    });

    $(document).on('click', '.pop-btn', function () {
      openModal(parseInt($(this).data('pop-id'), 10));
    });

    $('.mfb').on('click', function () {
      $('.mfb').removeClass('on');
      $(this).addClass('on');
      var mc = $(this).data('mc');
      mmarkers.forEach(function (item) {
        if (mc === 'all' || item.d.tags.indexOf(mc) !== -1) {
          item.m.addTo(lmap);
        } else {
          lmap.removeLayer(item.m);
        }
      });
    });

    function fixSize() {
      lmap.invalidateSize();
    }
    if (immediate) {
      setTimeout(fixSize, 50);
      setTimeout(fixSize, 300);
      $(window).on('resize', fixSize);
    }
  }

  function watchMapSection() {
    var $ms = $('#map-sec');
    if (!$ms.length) return;
    if (page === 'map') {
      initMap(true);
      return;
    }
    if ('IntersectionObserver' in window) {
      var mapObs = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            initMap(false);
            mapObs.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      mapObs.observe($ms[0]);
    } else {
      initMap(false);
    }
  }

  /* ─── FAQ ─── */
  function initFaq() {
    $('.faq-q').on('click', function () {
      var $item = $(this).closest('.faq-item');
      var was = $item.hasClass('open');
      $('.faq-item').removeClass('open');
      if (!was) $item.addClass('open');
      $(this).attr('aria-expanded', !was);
    });
  }

  /* ─── Modal chi tiết ─── */
  function openModal(id) {
    var d = DESTS.find(function (x) {
      return x.id === id;
    });
    if (!d || !$('#modal').length) return;

    var $gal = $('#mgal');
    $gal.find('.mslide').remove();
    d.gal.forEach(function (em, i) {
      var $s = $('<div class="mslide"></div>');
      if (i === 0) $s.addClass('on');
      $s.css({ background: bgFor(d.cat), fontSize: '8rem' }).text(em);
      $gal.prepend($s);
    });

    var $gdots = $('#gdots').empty();
    d.gal.forEach(function (_, i) {
      var $dot = $('<button type="button" class="gdot"></button>');
      if (i === 0) $dot.addClass('on');
      $dot.on('click', function () {
        goGal(i);
      });
      $gdots.append($dot);
    });
    gi = 0;

    function goGal(n) {
      gi = (n + d.gal.length) % d.gal.length;
      $gal.find('.mslide').each(function (i) {
        $(this).toggleClass('on', i === gi);
      });
      $gdots.find('.gdot').each(function (i) {
        $(this).toggleClass('on', i === gi);
      });
    }

    $('#gprev').off('click').on('click', function () {
      goGal(gi - 1);
    });
    $('#gnext').off('click').on('click', function () {
      goGal(gi + 1);
    });

    $('#m-title').text(d.name);
    $('#m-loc').text(d.loc);
    $('#m-rating').text('★ ' + d.rating + ' (' + d.rev.toLocaleString('vi-VN') + ')');
    $('#m-cat').text(d.catL);
    $('#m-desc').text(d.long);
    $('#m-price').text(d.price);
    $('#m-time').text(d.bestTime);
    $('#m-dur').text(d.dur);

    var $hl = $('#m-highlights').empty();
    d.hl.forEach(function (h) {
      $hl.append($('<li></li>').text(h));
    });

    setTimeout(function () {
      if (miniMap) {
        miniMap.remove();
        miniMap = null;
      }
      if (!$('#mmap').length || typeof L === 'undefined') return;
      miniMap = L.map('mmap').setView([d.lat, d.lng], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(miniMap);
      L.marker([d.lat, d.lng]).addTo(miniMap).bindPopup(d.name).openPopup();
      miniMap.invalidateSize();
    }, 150);

    $('#modal').removeAttr('hidden').addClass('open');
    $('body').css('overflow', 'hidden');
  }

  function closeModal() {
    $('#modal').removeClass('open').attr('hidden', 'hidden');
    $('body').css('overflow', '');
  }

  function initModal() {
    $('#mcls').on('click', closeModal);
    $('#modal').on('click', function (e) {
      if (e.target === this) closeModal();
    });
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' && $('#modal').hasClass('open')) closeModal();
    });
  }

  window.openModal = openModal;

  /* ─── Newsletter ─── */
  function initNewsletter() {
    $('#nl-form').on('submit', function (e) {
      e.preventDefault();
      var name = $('#nl-name').val().trim();
      var email = $('#nl-email').val().trim();
      var agree = $('#nl-agree').is(':checked');
      var $msg = $('#nl-msg');
      var ok = true;

      $('.nli').removeClass('err');
      $msg.removeClass('ok er').hide();

      if (!name) {
        $('#nl-name').addClass('err');
        ok = false;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        $('#nl-email').addClass('err');
        ok = false;
      }
      if (!agree) {
        toast('Vui lòng đồng ý với điều khoản');
        return;
      }
      if (!ok) {
        $msg.text('Vui lòng điền đầy đủ thông tin hợp lệ.').addClass('er').show();
        return;
      }

      var $btn = $('#nl-sub').prop('disabled', true).text('Đang gửi…');
      setTimeout(function () {
        $('#nl-form')[0].reset();
        $msg
          .text('Cảm ơn ' + name + '! Đã đăng ký thành công.')
          .addClass('ok')
          .show();
        $btn.prop('disabled', false).text('Đăng ký ngay');
        toast('Đăng ký thành công!');
      }, 1200);
    });
  }

  /* ─── Khởi động ─── */
  $(function () {
    initCommon();
    initModal();

    if (page === 'home') initHome();
    if (page === 'dest') initDest();
    if (page === 'guide') initFaq();
    if (page === 'contact') initNewsletter();

    watchMapSection();

    if (page === 'contact') initNewsletter();
  });
})(jQuery);
