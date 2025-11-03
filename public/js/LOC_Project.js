// Display editable fields after selecting from dropdown menu
const divisionDropdown = document.getElementById("divDropdown");
const divisionInfo = document.getElementById("divisionInfo");
const buttonsContainer = document.getElementById("buttonsContainer");



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

    let divName = document.getElementById("divName").value.trim();
    let dean = document.getElementById("dean").value.trim();
    let penContact = document.getElementById("penContact").value.trim();
    let locRep = document.getElementById("locRep").value.trim();
    let chair = document.getElementById("chair").value.trim();
    let payee = document.getElementById("payee").value.trim();

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
    if (!payee) {
        document.getElementById("err-payee").style.display = "block";
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
    const inputs = document.querySelectorAll("#divName, #dean, #penContact, #locRep, #chair");

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

// Populated data for each division when selected from dropdown
const divisionData = {
    fineArts: {
        divName: "Fine Arts",
        dean: "Christie Gilliland",
        penContact: "Liz Peterson",
        locRep: "Monica Bowen",
        chair: "Paul Metevier"
    },
    humanities: {
        divName: "Humanities",
        dean: "Jamie Fitzgerald",
        penContact: "Liz Peterson",
        locRep: "Lisa Luengo",
        chair: "Katie Cunnion"
    },
    socialScience: {
        divName: "Social Science",
        dean: "Christie Gilliland",
        penContact: "Liz Peterson",
        locRep: "Joy Crawford",
        chair: "Mark Thomason"
    },
    english: {
        divName: "English",
        dean: "Jamie Fitzgerald",
        penContact: "Liz Peterson",
        locRep: "Jake Frye",
        chair: "Ian Sherman"
    },
    science: {
        divName: "Science",
        dean: "Miebeth Bustillo-Booth",
        penContact: "Heather Lambert",
        locRep: "Nicole Feider",
        chair: "Katy Shaw and Danny Najera"
    },
    businessLawEducation: {
        divName: "Business, Law, and Education",
        dean: "Lea Ann Simpson",
        penContact: "Mary Singer",
        locRep: "Jane Swenson",
        chair: "Lea Ann Simpson"
    },
    technology: {
        divName: "Technology",
        dean: "Lea Ann Simpson",
        penContact: "Angie Brenner",
        locRep: "Josh Archer",
        chair: "Michael Wood"
    },
    healthScience: {
        divName: "Health Science",
        dean: "Lionel Candido Flores",
        penContact: "",
        locRep: "Thom Jackson",
        chair: "Leslie Kessler"
    },
    trades: {
        divName: "Trades",
        dean: "Lea Ann Simpson",
        penContact: "Mary Singer",
        locRep: "Ben Orr",
        chair: "David Lewis"
    },
    transitionalStudies: {
        divName: "Transitional Studies",
        dean: "Lionel Candido Flores",
        penContact: "",
        locRep: "Thom Jackson",
        chair: ""
    }
};

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
    document.getElementById("divName").value = data.divName;
    document.getElementById("dean").value = data.dean;
    document.getElementById("penContact").value = data.penContact;
    document.getElementById("locRep").value = data.locRep;
    document.getElementById("chair").value = data.chair;
});
