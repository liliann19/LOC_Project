document.getElementById("edit-form").onsubmit = () => {
    clearErrors();

    let isValid = true;

    const academicProgram = (document.getElementById("academicProgram")?.value || "").trim();


    if (!academicProgram) {
    document.getElementById("err-academicProgram").style.display = "block";
    isValid = false;
    }
    
    return isValid, alert("Changes Saved!");
};


function clearErrors() {
    let errors = document.getElementsByClassName("errors");
    for (let i = 0; i < errors.length; i++) {
        errors[i].style.display = "none";
    }
}