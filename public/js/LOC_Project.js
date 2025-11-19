
// Success Popup Function
function showPopup(message) {
  const popup = document.getElementById("popup");
  const messageElement = document.getElementById("popupMessage");

  messageElement.textContent = message;

  popup.classList.remove("hidden");
  setTimeout(() => popup.classList.add("show"), 10);

  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.classList.add("hidden"), 300);
  }, 8000);
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
//can be changed
document.getElementById("form").onsubmit = () => {
    showPopup("Division saved successfully!");
};

