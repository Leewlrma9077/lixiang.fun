/* ============================================================
   李想个人网站 — 交互脚本
   ============================================================ */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 年份 ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 顶部导航：滚动显示 / 移动端菜单 ---------- */
  const navWrap = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  let lastY = 0;

  function onScroll() {
    const y = window.scrollY;
    if (y > 400) navWrap.classList.add("visible");
    else navWrap.classList.remove("visible");
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- 滚动渐入 + 技能条 ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- 数字计数动画 ---------- */
  function animateCount(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const target = parseFloat(el.dataset.to);
    const dec = parseInt(el.dataset.dec || "0", 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) {
      el.textContent = prefix + target.toFixed(dec) + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = (target * eased).toFixed(dec);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statNums = document.querySelectorAll(".stat-num");
  if ("IntersectionObserver" in window) {
    const sio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            sio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    statNums.forEach((el) => sio.observe(el));
  } else {
    statNums.forEach(animateCount);
  }

  /* ---------- 当前章节导航高亮 ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = navLinks ? navLinks.querySelectorAll("a") : [];
  if ("IntersectionObserver" in window && navAnchors.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navAnchors.forEach((a) => {
              a.classList.toggle("active", a.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- 背景光晕鼠标视差 ---------- */
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    const orbs = document.querySelectorAll(".orb");
    let raf = null;
    let mx = 0, my = 0;
    window.addEventListener(
      "mousemove",
      (e) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
        if (!raf) {
          raf = requestAnimationFrame(() => {
            orbs.forEach((orb, i) => {
              const depth = (i + 1) * 14;
              orb.style.translate = `${mx * depth}px ${my * depth}px`;
            });
            raf = null;
          });
        }
      },
      { passive: true }
    );
  }

  /* ---------- 视频：进入视口后再播放，省流量 ---------- */
  const video = document.querySelector(".glass-video");
  if (video) {
    if ("IntersectionObserver" in window) {
      const vio = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const p = video.play();
              if (p && p.catch) p.catch(() => {});
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.35 }
      );
      vio.observe(video);
    }
  }

  /* ---------- 访问次数统计（counterapi.dev，同会话不重复计数） ---------- */
  const visitEl = document.getElementById("visit-count");
  if (visitEl) {
    const counted = sessionStorage.getItem("lixiang-counted");
    const url = counted
      ? "https://api.counterapi.dev/v1/lixiang-fun/visits"
      : "https://api.counterapi.dev/v1/lixiang-fun/visits/up";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.count !== "undefined") {
          visitEl.textContent = Number(data.count).toLocaleString("en-US");
          if (!counted) sessionStorage.setItem("lixiang-counted", "1");
        } else {
          visitEl.textContent = "—";
        }
      })
      .catch(() => {
        visitEl.textContent = "—";
      });
  }
})();
