// Success Popup Function
function showPopup(message) {
    const popup = document.getElementById("popup");
    const messageElement = document.getElementById("popupMessage");

    messageElement.textContent = message;

    // show popup
    popup.classList.remove("hidden"); 
    popup.classList.add("show");

    // hide popup after 3 seconds
    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.classList.add("hidden"), 500);
    }, 3000);
}

// Clear error messages
function clearErrors() {
    document.querySelectorAll(".errors").forEach(span => {
        span.style.display = "none";
    });
}

// Form submission / Validation
document.getElementById("edit-form").onsubmit = (event) => {
    clearErrors();
    let isValid = true;

    // gets values from input fields
    const academicProgram = document.getElementById("academicProgram").value.trim();
    const payee = document.getElementById("payee").value.trim();
    const beenPaid = document.getElementById("beenPaid").value.trim();
    const submitted = document.getElementById("submitted").value.trim();

    // validate each field and display error if empty
    if (!academicProgram) {
        document.getElementById("err-academicProgram").style.display = "block";
        isValid = false;
    }

    if (!payee) {
        document.getElementById("err-payee").style.display = "block";
        isValid = false;
    }

    if (!beenPaid) {
        document.getElementById("err-beenPaid").style.display = "block";
        isValid = false;
    }

    if (!submitted) {
        document.getElementById("err-submitted").style.display = "block";
        isValid = false;
    }

    // if the form is invalid, prevent submission
    if (!isValid) {
        event.preventDefault();
    } else {
        // show success popup if all fields are valid 
        showPopup("Program saved successfully!");
    }
};