// Display editable fields after selecting from dropdown menu
const divisionDropdown = document.getElementById("divDropdown");
const divisionInfo = document.getElementById("divisionInfo");
const buttonsContainer = document.getElementById("buttonsContainer");

// get data from static json file on server
let divisionData = {};
let allPrograms = [];

fetch('/data/reports.json')
    .then(res => res.json())
    .then(data => {
        divisionData = data.divisionData;

    for (const divisionKey in divisionData) {
        const division = divisionData[divisionKey];
        if (division.programs && Array.isArray(division.programs)) {
            allPrograms.push(...division.programs.map(p => ({
                ...p,
                divisionName: division.divName 
            })));
        }
    }
});

// display / hide fields based on dropdown
function displayDivisionFields() {
    divisionDropdown.addEventListener("change", function () {
        if (this.value && this.value !== "Select") {
            divisionInfo.style.display = "block";
            buttonsContainer.style.display = "block";
        } else {
            divisionInfo.style.display = "none";
            buttonsContainer.style.display = "none";
        }
    });
}

displayDivisionFields();

// When cancel button is clicked, the form will reset and hide all fields and buttons
document.getElementById("form").onreset = () => {
    divisionInfo.style.display = "none";
    buttonsContainer.style.display = "none";
    divisionDropdown.value = "Select";
    clearErrors();
};

// To validate input fields and form
document.getElementById("form").onsubmit = () => {
    clearErrors();

    let isValid = true;

    const divName = (document.getElementById("divName")?.value || "").trim();
    const dean = (document.getElementById("dean")?.value || "").trim();
    const penContact = (document.getElementById("penContact")?.value || "").trim();
    const locRep = (document.getElementById("locRep")?.value || "").trim();
    const chair = (document.getElementById("chair")?.value || "").trim();

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

    return isValid;
};

// Reset validation by hiding all displayed error messages
function clearErrors() {
    let errors = document.getElementsByClassName("errors");
    for (let i = 0; i < errors.length; i++) {
        errors[i].style.display = "none";
    }
}

// Automatically hide an input's error message once the user starts typing
function hideErrorsInput() {
    const inputs = document.querySelectorAll("#divName, #dean, #penContact, #locRep, #chair, #academicProgram");

    inputs.forEach(input => {
        input.addEventListener("input", function () {
            const errorSpan = document.getElementById(`err-${this.id}`);
            if (errorSpan) {
                errorSpan.style.display = "none";
            }
        });
    });
}

hideErrorsInput();

// Event listener for dropdown selector change
document.getElementById("divDropdown").addEventListener("change", function () {
    const selectedDivision = this.value;

    // If dropdown is on "Select", no data shown
    if (selectedDivision === "Select") {
        document.querySelectorAll('#form input[type="text"]').forEach(input => (input.value = ""));
        return;
    }

    const data = divisionData[selectedDivision];

    // When division is selected, the division fields change to populated division names
    document.getElementById("divName").value = data.divName || "";
    document.getElementById("dean").value = data.dean || "";
    document.getElementById("penContact").value = data.penContact || "";
    document.getElementById("locRep").value = data.locRep || "";
    document.getElementById("chair").value = data.chair || "";
});