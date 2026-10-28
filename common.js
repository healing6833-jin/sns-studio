// 모든 화면이 함께 쓰는 값과 도구

const BRAND_LINE =
  "훼이맵은 12별자리와 8행성에 맞춘 싱글 에센셜 오일 20종으로 나에게 맞는 향을 찾도록 돕는 아로마테라피 브랜드입니다.";
const HOMEPAGE = "https://healing6833-jin.github.io";

// SNS·GEO 지침의 금지 표현
const BANNED = ["처방", "치유", "치료", "완치", "운명을 바꾼다", "불면증", "우울증", "효과 보장", "% 감소", "% 개선"];

// 채널별 글자 수 한도
const CHANNELS = [
  { id: "instagram", name: "인스타그램", limit: 2200, time: "08:00" },
  { id: "threads", name: "스레드", limit: 500, time: "12:00" },
  { id: "blog", name: "네이버 블로그", limit: 3000, time: "10:00" },
  { id: "youtube", name: "유튜브 쇼츠", limit: 100, time: "18:00", note: "제목 기준" },
];

// 브라우저 저장소: 막혀 있어도 화면은 동작하게 try/catch로 감싼다
function loadPosts() {
  try { return JSON.parse(localStorage.getItem("sns-posts") || "[]"); } catch { return []; }
}
function savePosts(posts) {
  try { localStorage.setItem("sns-posts", JSON.stringify(posts)); } catch {}
}

function findBanned(text) {
  return BANNED.filter((word) => text.includes(word));
}

function toast(message) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 1600);
}

function escapeHtml(text) {
  return text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}
