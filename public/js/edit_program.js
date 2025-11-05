// Edit Program form validation
document.getElementById("edit-form").onsubmit = () => {
    // clear any existing error messages
    clearErrors();

    let isValid = true;

    // get user input and trim
    const academicProgram = (document.getElementById("academicProgram")?.value || "").trim();

    // validate required field
    if (!academicProgram) {
    document.getElementById("err-academicProgram").style.display = "block";
    isValid = false;
    }
    
    return isValid, alert("Changes Saved!");
};

// Reset validation by hiding all displayed error messages
function clearErrors() {
    let errors = document.getElementsByClassName("errors");
    for (let i = 0; i < errors.length; i++) {
        errors[i].style.display = "none";
    }
}