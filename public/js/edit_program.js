// can be changed
// Success Popup Function
function showPopup(message) {
  const popup = document.getElementById("popup");
  const messageElement = document.getElementById("popupMessage");

  messageElement.textContent = message;

  popup.classList.remove("hidden");
  setTimeout(() => popup.classList.add("show"), 10);

  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.classList.add("hidden"), 300);
  }, 8000);
}


document.getElementById("edit-form").onsubmit = () => {
    clearErrors();
    let isValid = true;

    const academicProgram = (document.getElementById("academicProgram")?.value || "").trim();

    if (!academicProgram) {
        document.getElementById("err-academicProgram").style.display = "block";
        isValid = false;
    }

    // can be changed
    // show popup only whem valid
    if (isValid) {
    showPopup("Program saved successfully!");
    }



    return isValid; 
};

function clearErrors() {
    document.querySelectorAll(".errors").forEach(span => {
        span.style.display = "none";
    });
}