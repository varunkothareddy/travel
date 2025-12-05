document.addEventListener("DOMContentLoaded", () => {
  // 🔗 Your SheetDB endpoint
  const SHEET_URL = "https://sheetdb.io/api/v1/z1ir5g6powleo";

  // 🧾 Form + elements
  const form = document.getElementById("sheetdb");
  const nameInput = document.getElementById("uname");
  const mobileInput = document.getElementById("umobile");
  const submitBtn = document.getElementById("submitBtn");
  const textEl = document.querySelector(".text");
  const progressEl = document.querySelector(".progress-bar");
  const checkPath = document.querySelector(".check");
  const checkSvg = document.querySelector(".check-svg");
  const card = document.querySelector(".d1"); // the form card

  // Hide check initially
  checkSvg.style.opacity = "0";

  // Prepare SVG path for drawing animation
  const offset = anime.setDashoffset(checkPath);
  checkPath.setAttribute("stroke-dashoffset", offset);

  // 🧼 Reset everything back to normal
  function resetVisualState() {
    // Reset button appearance
    textEl.style.opacity = "1";
    submitBtn.style.width = "200px";
    submitBtn.style.height = "60px";

    // Reset progress bar
    progressEl.style.width = "0px";
    progressEl.style.height = "10px";

    // Hide checkmark
    checkSvg.style.opacity = "0";
    checkPath.setAttribute("stroke-dashoffset", offset);

    // Remove dark overlay
    card.classList.remove("animating");
  }

  // 🎬 Anime.js timeline for the button + bar + tick
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

  // ✅ After full animation finishes
  basicTimeline.finished.then(() => {
    // Show checkmark
    checkSvg.style.opacity = "1";

    // After 1.5 seconds, reset back to original SUBMIT state
    setTimeout(() => {
      resetVisualState();
    }, 1500);
  });

  // 🚀 Handle click on the animated submit button
  async function handleSubmitClick() {
    const name = nameInput.value.trim();
    const mobile = mobileInput.value.trim();

    // Prevent double-click during animation
    if (card.classList.contains("animating")) {
      return;
    }

    // 10-digit mobile validation
    if (mobile.length !== 10 || !/^[0-9]+$/.test(mobile)) {
      alert("Please enter correct mobile number");
      return;
    }

    // Show dark overlay + clean state
    resetVisualState();
    card.classList.add("animating");

    // Start animation
    basicTimeline.restart();

    // Prepare form data for SheetDB
    const formData = new FormData(form);

    try {
      const response = await fetch(SHEET_URL, {
        method: "POST",
        body: formData
      });
      await response.json();

      // Clear inputs after successful submit
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      // Reset UI on error as well
      resetVisualState();
    }
  }

  // 🎯 Click handler for the button (not form submit)
  submitBtn.addEventListener("click", handleSubmitClick);
});
