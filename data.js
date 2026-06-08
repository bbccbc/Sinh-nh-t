// ============================================================
//  data.js — Plug-and-Play Configuration
//  Edit ONLY this file to personalise the experience.
// ============================================================

const config = {

  /* ── Identity ───────────────────────────────────────────── */
  recipientName: "Hagiang",

  /* ── Password ───────────────────────────────────────────── */
  secretPassword: "0806",
  wrongPasswordMessage:
    "Oopsss, sai mất òi. Thử làm lại nhee",

  /* ── Webhook (Discord / Telegram / Make / n8n) ───────────
     Paste your webhook URL here. Leave empty string "" to
     skip sending and just log to console instead.          */
  webhookUrl: "8999b326-a085-4f14-bc75-7b3fb96c3157",

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
  letterContent: `Surprise surpriseeee!!!
Không biết lúc cậu mở được bức thư này ra là mấy giờ ngày 08/06 nhỉ. Cái này thì tớ không đoán được rồi… hì hì 
Tớ mong cậu sẽ thích món quà tớ tặng, mặc dù theo tớ thí thì nó hơi lộn xộn và nhiều thứ chưa đúng ý tớ lắm. Có thể nói đây là lần tặng quà đặc biệt nhất của tớ, tớ đã vừa học vừa làm để hoàn thành món quà này.
Cậu đã nhận được bình và hoa chưa? Lúc chọn quà tớ mới nghĩ là không biết tặng gì thì cậu sẽ thích nhỉ? Tớ nghĩ cậu là người thích trang trí nhà, vậy nên chắc có thêm bình hoa nữa thì quá trời tuyệt vời rùi! Thế là tớ mua luôn. Không biết hoa có thơm không nhỉ? Trời nắng quá tớ mong là hoa không bị héo khi tới tay cậu.
Đừng quá xúc động nka 😏Tớ đã thấy những người biết code rất ngầu, giờ tớ vẫn thí ngầu. Tớ sẽ cố gắng chăm chỉ học hành để món quà lần sau hoàn thiện hơnn nhé… Đảm bảo quà là độc nhất vô nhị 01 ai có ❤️
Giữ gìn sức khỏe nhé! Đừng để bị ốm nữa nhé <3`,

  /* ── Birthday Countdown (June 7 23:00 → June 8 00:00) ─── */
  birthdayYear: 2025,   // Change year if needed
  birthdayMonth: 6,      // June = 6
  birthdayDay: 8,      // Birthday is June 8
  birthdayCakeMessage: "Sinh nhật vui vẻ nhé, Hagiang",
};
