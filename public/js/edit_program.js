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

function clearErrors() {
    document.querySelectorAll(".errors").forEach(span => {
        span.style.display = "none";
    });
}
