// Display editable fields after selecting from dropdown menu
const divisionDropdown = document.getElementById("divDropdown");
const divisionInfo = document.getElementById("divisionInfo");
const buttonsContainer = document.getElementById("buttonsContainer");

function displayDivisionFields (){
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
document.getElementById('form').onsubmit= () => {
    clearErrors();

    let isValid = true;

    let divName = document.getElementById('divName').value.trim();
    let dean = document.getElementById('dean').value.trim();
    let penContact = document.getElementById('penContact').value.trim();
    let locRep = document.getElementById('locRep').value.trim();
    let chair = document.getElementById('chair').value.trim();
    

    if (!divName){
        document.getElementById('err-divName').style.display = "block";
        isValid = false;
    };

    if (!dean){
        document.getElementById('err-dean').style.display = "block";
        isValid = false;
    };

    if (!penContact){
        document.getElementById('err-penContact').style.display = "block";
        isValid = false;
    };

        if (!locRep){
            document.getElementById('err-locRep').style.display = "block";
            isValid = false;
        };

    if (!chair){
        document.getElementById('err-chair').style.display = "block";
        isValid = false;
    };

    return isValid;
}

// Reset validation by hiding all displayed error messages
function clearErrors()  {
    let errors = document.getElementsByClassName("errors");
        for (let i = 0; i < errors.length; i++){
            errors[i].style.display = "none"
        }
}

// Automatically hide an inputs error message once the user starts typing
function hideErrorsInput() { 
    const inputs = document.querySelectorAll("#divName, #dean, #penContact, #locRep, #chair");

    inputs.forEach(input => {
        input.addEventListener("input", function() {
            const errorSpan = document.getElementById(`err-${this.id}`);
            if (errorSpan) {
                errorSpan.style.display = "none";
            }
        });
    });
}

hideErrorsInput();

