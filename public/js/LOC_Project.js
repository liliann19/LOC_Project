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

const divisionData = {
    fineArts: {
        divName: "Fine Arts",
        dean: "Meryl Streep",
        penContact: "Leonardo DiCaprio",
        locRep: "Natalie Portman",
        chair: "Morgan Freeman"
    },
    humanities: {
        divName: "Humanities",
        dean: "Emma Watson",
        penContact: "Tom Hanks",
        locRep: "Anne Hathaway",
        chair: "Robert Downey Jr."
    },
    socialScience: {
        divName: "Social Science",
        dean: "Viola Davis",
        penContact: "Ryan Gosling",
        locRep: "Zendaya",
        chair: "Denzel Washington"
    },
    english: {
        divName: "English",
        dean: "Kate Winslet",
        penContact: "Benedict Cumberbatch",
        locRep: "Florence Pugh",
        chair: "Hugh Jackman"
    },
    technology: {
        divName: "Technology",
        dean: "Scarlett Johansson",
        penContact: "Chris Evans",
        locRep: "Zoe Saldana",
        chair: "Keanu Reeves"
    },
    healthScience: {
        divName: "Health Science",
        dean: "Sandra Bullock",
        penContact: "Idris Elba",
        locRep: "Gal Gadot",
        chair: "Matthew McConaughey"
    },
    trades: {
        divName: "Trades",
        dean: "Jason Momoa",
        penContact: "Jennifer Lawrence",
        locRep: "Chris Pratt",
        chair: "Margot Robbie"
    }
};

document.getElementById('divDropdown').addEventListener('change', function() {
    const selectedDivision = this.value;


    if (selectedDivision === "Select") {
        document.querySelectorAll('#form input[type="text"]').forEach(input => input.value = "");
        return;
    }

    const data = divisionData[selectedDivision];

    document.getElementById('divName').value = data.divName;
    document.getElementById('dean').value = data.dean;
    document.getElementById('penContact').value = data.penContact;
    document.getElementById('locRep').value = data.locRep;
    document.getElementById('chair').value = data.chair;
});