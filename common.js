// 모든 화면이 함께 쓰는 값과 도구

const BRAND_LINE =
  "훼이맵은 12별자리와 8행성에 맞춘 싱글 에센셜 오일 20종으로 나에게 맞는 향을 찾도록 돕는 아로마테라피 브랜드입니다.";
const HOMEPAGE = "https://healing6833-jin.github.io";

// SNS·GEO 지침의 금지 표현
const BANNED = ["처방", "치유", "치료", "완치", "운명을 바꾼다", "불면증", "우울증", "효과 보장", "% 감소", "% 개선"];

// 채널별 글자 수 한도 (video: 같은 세로 영상 하나를 올리는 채널)
const CHANNELS = [
  { id: "instagram", name: "인스타그램", limit: 2200, time: "08:00" },
  { id: "threads", name: "스레드", limit: 500, time: "12:00" },
  { id: "blog", name: "네이버 블로그", limit: 3000, time: "10:00" },
  { id: "youtube", name: "유튜브 쇼츠", limit: 100, time: "18:00", note: "제목 기준", video: true },
  { id: "reels", name: "인스타 릴스", time: "18:00", video: true },
  { id: "clip", name: "네이버 클립", time: "18:00", video: true },
];

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast("복사했습니다. 붙여넣어 주세요"); }
  catch { toast("복사가 막혀 있습니다. 글을 직접 선택해 주세요"); }
}

// 브라우저 저장소: 막혀 있어도 화면은 동작하게 try/catch로 감싼다
function loadPosts() {
  try { return JSON.parse(localStorage.getItem("sns-posts") || "[]"); } catch { return []; }
}
function savePosts(posts) {
  try { localStorage.setItem("sns-posts", JSON.stringify(posts)); } catch {}
}

// 이번 주 콘텐츠(data/week.json)를 내 글 목록에 합친다.
// 한 번 불러온 글은 기억해 두어, 기록에서 지운 글이 다시 생기지 않게 한다.
async function syncWeek() {
  try {
    const res = await fetch("data/week.json", { cache: "no-store" });
    if (!res.ok) return null;
    const week = await res.json();
    let seen;
    try { seen = JSON.parse(localStorage.getItem("sns-imported") || "[]"); } catch { seen = []; }
    const fresh = week.posts.filter((p) => !seen.includes(p.id));
    // 이미 불러온 글은 최신 내용(블로그 · 장면 등)으로 바꾸되 발행 체크는 유지한다
    const posts = loadPosts().map((p) => {
      const latest = week.posts.find((x) => x.id === p.id);
      return latest ? { ...latest, done: p.done || {} } : p;
    });
    posts.push(...fresh.map((p) => ({ ...p, done: {} })));
    posts.sort((a, b) => b.date.localeCompare(a.date));
    savePosts(posts);
    if (fresh.length) {
      try { localStorage.setItem("sns-imported", JSON.stringify([...seen, ...fresh.map((p) => p.id)])); } catch {}
    }
    return week;
  } catch {
    return null;
  }
}

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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
