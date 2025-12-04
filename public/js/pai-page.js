/*
  pai-page.js 
  
  JavaScript for the PAI Year-Program Schedule page.

  Responsibilities:
  - Handles the "Edit", "Save", and "Cancel" workflow for the PAI checkboxes.
  - Tracks original checkbox state to allow reverting on cancel.
  - Sends updated checkbox states to the server via POST request to /saveYearMatrix.
  - Shows success/error popups for user feedback.
  - Displays a spinner while saving changes to indicate progress.
  - Ensures checkboxes are disabled outside of edit mode.
*/


// Success Popup Function
function showPopup(message) {
    const popup = document.getElementById("popup");
    const messageElement = document.getElementById("popupMessage");

    if (!popup || !messageElement) return;

    messageElement.textContent = message;

    // Show popup message
    popup.classList.remove("hidden");
    popup.classList.add("show");

    // Hide popup after 2 seconds
    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.classList.add("hidden"), 500);
    }, 2000);
}

const editBtn = document.getElementById("editMode");
const saveBtn = document.getElementById("saveChanges");
const cancelBtn = document.getElementById("cancelChanges");
const checkboxes = document.querySelectorAll(".ur-box");

// Store original checkbox state for cancel button
let originalState = [];

if (editBtn && saveBtn && cancelBtn && checkboxes.length > 0) {

    // Edit Mode
    editBtn.addEventListener("click", () => {
        // Save the original checkbox states before editing
        originalState = Array.from(checkboxes).map(box => box.checked);

        // Enable all checkboxes for editing
        checkboxes.forEach(box => box.disabled = false);

        // Show Save and Cancel buttons
        saveBtn.style.display = "inline-block";
        cancelBtn.style.display = "inline-block";
    });

    // Save Changes
    saveBtn.addEventListener("click", async () => {
        const updates = Array.from(checkboxes).map(box => ({
            programId: box.dataset.program,
            year: box.dataset.year,
            underReview: box.checked ? "yes" : "no"
        }));

        try {
            const res = await fetch("/saveYearMatrix", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ updates })
            });

            const data = await res.json();

            if (data.success) {
                showPopup("Saved successfully!");
                // Disable checkboxes again
                checkboxes.forEach(box => box.disabled = true);

                // Hide Save and Cancel buttons
                saveBtn.style.display = "none";
                cancelBtn.style.display = "none";
            } else {
                showPopup("Error saving data");
            }

        } catch (err) {
            console.error(err);
            showPopup("Error saving data");
        }
    });

    // Cancel Changes
    cancelBtn.addEventListener("click", () => {
        // Revert checkboxes to their original state
        checkboxes.forEach((box, idx) => {
            box.checked = originalState[idx];
            box.disabled = true;
        });

        // Hide Save and Cancel buttons
        saveBtn.style.display = "none";
        cancelBtn.style.display = "none";

        // Show popup for feedback
        showPopup("Changes canceled");
    });
}


const spinner = document.getElementById("savingSpinner");

saveBtn.addEventListener("click", async () => {
    const updates = Array.from(checkboxes).map(box => ({
        programId: box.dataset.program,
        year: box.dataset.year,
        underReview: box.checked ? "yes" : "no"
    }));

    try {
        // Show spinner
        spinner.classList.remove("hidden");

        const res = await fetch("/saveYearMatrix", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ updates })
        });

        const data = await res.json();

        // Hide spinner
        spinner.classList.add("hidden");

        if (data.success) {
            showPopup("Saved successfully!");
            checkboxes.forEach(box => box.disabled = true);
            saveBtn.style.display = "none";
            cancelBtn.style.display = "none";
        } else {
            showPopup("Error saving data");
        }

    } catch (err) {
        spinner.classList.add("hidden");
        console.error(err);
        showPopup("Error saving data");
    }
});
