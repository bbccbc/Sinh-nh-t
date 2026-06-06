// ============================================================
//  data.js — Plug-and-Play Configuration
//  Edit ONLY this file to personalise the experience.
// ============================================================

const config = {

  /* ── Identity ───────────────────────────────────────────── */
  recipientName: "Hagiang",

  /* ── Password ───────────────────────────────────────────── */
  secretPassword: "11",
  wrongPasswordMessage:
    "Oopss, sai mất òi. Thử làm lại nhee",

  /* ── Webhook (Discord / Telegram / Make / n8n) ───────────
     Paste your webhook URL here. Leave empty string "" to
     skip sending and just log to console instead.          */
  webhookUrl: "1e6ecbe5-33a3-4c2d-b9cc-2742df17d469",

  /* ── Screen 2 — Scheduler ───────────────────────────────── */
  schedulerTitle: "･ﾟ☆･ﾟHệ thống này cần xác nhận khung giờ rảnh của cậu vào thứ Hai để kích hoạt một bất ngờ!!･ﾟ✧･ﾟ",
  schedulerPlaceholder: "Nếu có gì cậu muốn gửi gắm tới tớ...",
  schedulerSlots: [
    { value: "morning", label: "Buổi sáng", sub: "7:00 – 11:00" },
    { value: "afternoon", label: "Buổi chiều", sub: "13:00 – 17:00" },
    { value: "evening", label: "Buổi tối", sub: "18:00 – 20:00" },
  ],

  /* ── Screen 3 — Lock ────────────────────────────────────── */
  lockHint: "Một mật mã nhỏ sẽ được gửi tới vào thứ Hai, sau đó cậu mới có thể mở được bí mật nàyy.",
  lockSub: "This is our secret ❤️",
  /* ── Screen 3.5 — Puzzle ───────────────────────────────── */
  puzzleImage: 'image/puzzle.JPG',
  // Dùng ảnh có tỉ lệ 1:1 (vuông) để đẹp nhất
  // Khuyến nghị: 640×640px hoặc 800×800px
  /* ── Screen 4 — Gallery ─────────────────────────────────── */
  galleryPhotos: [
    { url: "image/hg1.jpg", caption: "ảnh này cutee thíii, quá yêu nụ cười nàyy 彡" },
    { url: "image/hg2.jpg", caption: "rất thích cậu dùng những món quà tớ tặng.." },
    { url: "image/hg3.jpg", caption: "ứ ừ dịu quớ ờ <33" },
    { url: "image/hg4.jpg", caption: "Tớ rất thích những bức ảnh như thế này..." },
    { url: "image/hg5.jpg", caption: "trông cậu thật dịu dàng.." },
    { url: "image/hg6.jpg", caption: "...cậu chụp ảnh rất đẹp" },
    { url: "image/hg7.jpg", caption: "ngầu đétttt" },
    { url: "image/hg8.PNG", caption: "thích ảnh này lắm í" },
    { url: "image/mèo.jpg", caption: "năm nay có thêm nàng mèo đón sinh nhật cùng nhá >< giao diện hổ báo, bát nháo iu emm" },
  ],

  /* ── Screen 5 — Letter ──────────────────────────────────── */
  letterTitle: "Gửi Hagiang,",
  letterContent: `Bức thư này được viết bằng tất cả những điều mình muốn nói mà chưa có cơ hội nói ra.\n\nMỗi ngày trôi qua mình đều nhận ra, có những người mình không thể không nhớ tới — dù chỉ một lần. Cậu là một trong số ít người như vậy.\n\nMình hi vọng bất ngờ nhỏ này làm cậu mỉm cười, dù chỉ một giây thôi. Vì nụ cười của cậu đáng để cả thế giới dừng lại. Năm nay, mẹ em gần bốn mươi mốt tuổi. Với thân hình mảnh mai, thon thả đã tô đậm cho mẹ với vẻ đẹp của người mẹ hiền từ, mái tóc đen óng mượt mà dài ngang lưng được mẹ thắt lên gọn gàng khi ra đường. Đôi mắt mẹ đen láy luôn nhìn em với ánh mắt trìu mến gần gũi. Khuôn mặt mẹ hình trái xoan với làn da trắng. Đôi môi mỏng đỏ hồng nằm dưới chiếc mũi cao thanh tú làm cho càng nhìn càng thấy đẹp. Khi cười nhìn mẹ tươi như hoa, đóa hoa hồng vừa nở sớm mai. Đôi bàn tay mẹ tròn trịa, trắng trẻo đã nuôi nấng, dìu dắt em từ thuở em vừa lọt lòng. Giọng nói của mẹ đầy truyền cảm, lúc mượt mà như tiếng ru, lúc ngân nga như tiếng chim họa mi buổi sớm. Mẹ em may và thêu rất đẹp, đặc biệt là may áo dài, thường ngày mẹ hay mặc bộ đồ bộ gọn gàng, khi đi dạy học mẹ mặc những bộ áo dài cũng do mẹ tự may trông thật duyên dáng, sang trọng.

Ở nhà, mẹ là người đảm nhiệm công việc nội trợ. Mẹ giao cho em các công việc nhẹ nhàng như: quét nhà, gấp quần áo. Còn ba thì phụ mẹ giặt đồ, dọn dẹp nhà cửa sạch sẽ, thỉnh thoảng mẹ mua hoa về chưng ở phòng khách cho đẹp nhà. Mỗi khi khách đến mẹ luôn đón tiếp nồng hậu, mời khách một đĩa trái cây và nước mát. Sáng mẹ là người thức dậy sớm để chuẩn bị thức ăn sáng cho cả nhà, để hai anh em cùng cắp sách đến trường kịp giờ học. Khi em ốm đau mẹ phải thức suốt đêm để chăm sóc. Buổi tối, mẹ thường dành khoảng ba mươi phút để giảng bài cho em, sau đó mẹ ngồi chấm bài, soạn giáo án chuẩn bị cho tiết lên lớp ngày mai ở trường. Mẹ rất nhân hậu, hiền từ, khi lên lớp mẹ xem học trò như các con của mình, cũng dìu dắt thương yêu hết mực nên mẹ được rất nhiều học sinh yêu mến. Khi em phạm lỗi, mẹ chỉ nhắc nhở chứ không mắng và cũng chưa đánh em bao giờ.\n\nHappy Birthday, Hagiang 🌿`,

  /* ── Birthday Countdown (June 7 23:00 → June 8 00:00) ─── */
  birthdayYear: 2025,   // Change year if needed
  birthdayMonth: 6,      // June = 6
  birthdayDay: 8,      // Birthday is June 8
  birthdayCakeMessage: "Sinh nhật vui vẻ, Hagiang! 🎂🌿",
};
