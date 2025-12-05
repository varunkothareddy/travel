document.addEventListener("DOMContentLoaded", () => {
  const SHEET_URL = "https://sheetdb.io/api/v1/z1ir5g6powleo";

  const form = document.getElementById("sheetdb");
  const nameInput = document.getElementById("uname");
  const mobileInput = document.getElementById("umobile");
  const submitBtn = document.getElementById("submitBtn");
  const textEl = document.querySelector(".text");
  const progressEl = document.querySelector(".progress-bar");
  const checkPath = document.querySelector(".check");
  const checkSvg = document.querySelector(".check-svg");
  const card = document.querySelector(".d1");

  // sounds (optional)
  const clickSound = document.getElementById("clickSound");
  const successSound = document.getElementById("successSound");

  // theme toggle
  const themeToggle = document.getElementById("themeToggle");
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark")
      ? "☀️"
      : "🌙";
  });

  // hide check initially
  checkSvg.style.opacity = "0";

  // prepare SVG path
  const offset = anime.setDashoffset(checkPath);
  checkPath.setAttribute("stroke-dashoffset", offset);

  // reset visuals back to normal
  function resetVisualState() {
    textEl.style.opacity = "1";
    submitBtn.style.width = "100%"; // matches CSS
    submitBtn.style.height = ""; // let CSS control

    progressEl.style.width = "0px";
    progressEl.style.height = "8px";

    checkSvg.style.opacity = "0";
    checkPath.setAttribute("stroke-dashoffset", offset);

    card.classList.remove("animating");
  }

  // simple confetti burst
  function fireConfetti() {
    if (typeof confetti !== "function") return;
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  // anime.js timeline
  const basicTimeline = anime.timeline({
    autoplay: false
  });

  basicTimeline
    .add({
      targets: ".text",
      duration: 1,
      opacity: 0
    })
    .add({
      targets: ".button",
      duration: 1300,
      height: 10,
      width: 300,
      backgroundColor: "#2B2D2F",
      borderRadius: 100
    })
    .add({
      targets: ".progress-bar",
      duration: 2000,
      width: 300,
      easing: "linear"
    })
    .add({
      targets: ".button",
      width: 0,
      duration: 1
    })
    .add({
      targets: ".progress-bar",
      width: 80,
      height: 80,
      delay: 500,
      duration: 750,
      borderRadius: 80,
      backgroundColor: "#71DFBE"
    })
    .add({
      targets: ".check",
      strokeDashoffset: [offset, 0],
      duration: 200,
      easing: "easeInOutSine"
    });

  // after animation finishes
  basicTimeline.finished.then(() => {
    checkSvg.style.opacity = "1";

    // success sound
    if (successSound) {
      successSound.currentTime = 0;
      successSound.play();
    }

    // confetti
    fireConfetti();

    // reset back after short delay
    setTimeout(() => {
      resetVisualState();
    }, 1500);
  });

  // main handler
  async function handleSubmitClick() {
    // prevent double-click during anim
    if (card.classList.contains("animating")) return;

    const mobile = mobileInput.value.trim();

    // 10-digit validation
    if (mobile.length !== 10 || !/^[0-9]+$/.test(mobile)) {
      alert("Please enter correct mobile number");
      return;
    }

    // click sound
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play();
    }

    resetVisualState();
    card.classList.add("animating");

    basicTimeline.restart();

    // send data to SheetDB
    const formData = new FormData(form);

    try {
      const response = await fetch(SHEET_URL, {
        method: "POST",
        body: formData
      });
      await response.json();
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      resetVisualState();
    }
  }

  submitBtn.addEventListener("click", handleSubmitClick);
});
