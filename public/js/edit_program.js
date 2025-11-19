// showPopup.js

function showPopup(message) {
    const popup = document.getElementById("popup");
    const messageElement = document.getElementById("popupMessage");

    messageElement.textContent = message;
    popup.classList.remove("hidden"); // show popup
    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.classList.add("hidden"), 500);
    }, 3000);
}

function clearErrors() {
    document.querySelectorAll(".errors").forEach(span => {
        span.style.display = "none";
    });
}

document.getElementById("edit-form").onsubmit = (event) => {
    clearErrors();
    let isValid = true;

    const academicProgram = document.getElementById("academicProgram").value.trim();
    const payee = document.getElementById("payee").value.trim();
    const beenPaid = document.getElementById("beenPaid").value.trim();
    const submitted = document.getElementById("submitted").value.trim();

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

    if (!isValid) {
        event.preventDefault();
    } else {
        showPopup("Program saved successfully!");
    }

};
