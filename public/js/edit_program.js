// Edit program form validation 
document.getElementById("edit-form").onsubmit = () => {
    clearErrors();
    let isValid = true;

    const academicProgram = (document.getElementById("academicProgram")?.value || "").trim();

    if (!academicProgram) {
        document.getElementById("err-academicProgram").style.display = "block";
        isValid = false;
    }

    return isValid; 
};

// Clear errors
function clearErrors() {
    document.querySelectorAll(".errors").forEach(span => {
        span.style.display = "none";
    });
}
