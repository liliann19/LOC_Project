// Success Popup Function
function showPopup(message) {
    const popup = document.getElementById("popup");
    const messageElement = document.getElementById("popupMessage");

    messageElement.textContent = message;

    popup.classList.remove("hidden");
    setTimeout(() => popup.classList.add("show"), .5);

    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.classList.add("hidden"), 50000000000);
    }, 800000000000);
}

const divisionDropdown = document.getElementById("divDropdown");
const divisionInfo = document.getElementById("editInfo");
const buttonsContainer = document.getElementById("buttonsContainer");

// Get data from sql
async function loadDivisionFromSQL(divKey) {
    if (!divKey) return null;
    //this route is in app.js
    const res = await fetch(`/api/division/${divKey}`);
    const rows = await res.json();
    return rows[0] || null;
}

divisionDropdown.addEventListener("change", async function () {
    const selectedKey = this.value;

    if (selectedKey) {
        divisionInfo.style.display = "block";
        buttonsContainer.style.display = "block";

        const division = await loadDivisionFromSQL(selectedKey);

        if (division) {
            document.getElementById("divisionId").value = division.id;
            document.getElementById("divName").value = division.divName || "";
            document.getElementById("dean").value = division.dean || "";
            document.getElementById("penContact").value = division.penContact || "";
            document.getElementById("locRep").value = division.locRep || "";
            document.getElementById("chair").value = division.chair || "";
        }
    } else {
        divisionInfo.style.display = "none";
        buttonsContainer.style.display = "none";
    }
});

document.getElementById("edit-form").onreset = () => {
    divisionInfo.style.display = "none";
    buttonsContainer.style.display = "none";
    divisionDropdown.value = "";

    showPopup("Changes canceled");
};

//save button
// Validation logic
document.getElementById("edit-form").onsubmit = () => {
    clearErrors();
    let isValid = true;

    const divName = document.getElementById("divName").value.trim();
    const dean = document.getElementById("dean").value.trim();
    const penContact = document.getElementById("penContact").value.trim();
    const locRep = document.getElementById("locRep").value.trim();
    const chair = document.getElementById("chair").value.trim();

    if (!divName) {
        document.getElementById("err-divName").style.display = "block";
        isValid = false;
    }
    if (!dean) {
        document.getElementById("err-dean").style.display = "block";
        isValid = false;
    }
    if (!penContact) {
        document.getElementById("err-penContact").style.display = "block";
        isValid = false;
    }
    if (!locRep) {
        document.getElementById("err-locRep").style.display = "block";
        isValid = false;
    }
    if (!chair) {
        document.getElementById("err-chair").style.display = "block";
        isValid = false;
    }
    if (isValid) {
        showPopup("Division saved successfully!");
    }

    return isValid;
};

// Hide errors when typing
function hideErrorsInput() {
    const inputs = document.querySelectorAll("#divName, #dean, #penContact, #locRep, #chair");

    inputs.forEach(input => {
        input.addEventListener("input", function () {
            const errorSpan = document.getElementById(`err-${this.id}`);
            if (errorSpan) errorSpan.style.display = "none";
        });
    });
}

hideErrorsInput();

// Reset all error displays
function clearErrors() {
    let errors = document.getElementsByClassName("errors");
    for (let i = 0; i < errors.length; i++) {
        errors[i].style.display = "none";
    }
}

// Cancel button resets and hides UI
document.getElementById("edit-form").onreset = () => {
    divisionInfo.style.display = "none";
    buttonsContainer.style.display = "none";
    divisionDropdown.value = "Select";
    clearErrors();
};
