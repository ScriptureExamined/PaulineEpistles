document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const successBox = document.getElementById("form-success");
  const errorBox = document.getElementById("form-error");
  const submitBtn = document.getElementById("contact-submit");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    successBox.hidden = true;
    errorBox.hidden = true;

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";

    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xeepjdjl", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        form.reset(); // ✅ clears the form
        successBox.hidden = false;
      } else {
        errorBox.hidden = false;
      }
    } catch (error) {
      errorBox.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});