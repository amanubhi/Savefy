// Get references to UI elements
const userInput = document.getElementById("user-input");
const saveInputBtn = document.getElementById("save-input");
const saveTabBtn = document.getElementById("save-tab");
const deleteAllBtn = document.getElementById("delete-all");
const messageEl = document.getElementById("message");
const savedInputDisplay = document.getElementById("saved-input-display");
const inputHistoryEl = document.getElementById("input-history");
const tabHistoryEl = document.getElementById("tab-history");

// Function to display a message
function displayMessage(text) {
    messageEl.textContent = text;
    messageEl.style.display = "block";

    // Hide the message after a few seconds
    setTimeout(() => {
        messageEl.style.display = "none";
    }, 3000);
}

// Function to display saved history on the UI
function displaySavedHistory() {
    // Retrieve saved input history and display it
    chrome.storage.local.get(["inputHistory"], (result) => {
        const inputHistory = result.inputHistory || [];
        inputHistoryEl.innerHTML = ""; // Clear the existing list

        inputHistory.forEach((input, index) => {
            const li = document.createElement("li");
            li.textContent = input;
            inputHistoryEl.appendChild(li);
        });
    });

    // Retrieve saved tab history and display it
    chrome.storage.local.get(["tabUrls"], (result) => {
        const tabUrls = result.tabUrls || [];
        tabHistoryEl.innerHTML = ""; // Clear the existing list

        tabUrls.forEach((url, index) => {
            const li = document.createElement("li");
            li.textContent = url;
            tabHistoryEl.appendChild(li);
        });
    });
}

// Save input text to Chrome storage and display message
saveInputBtn.addEventListener("click", () => {
    const inputValue = userInput.value;
    if (inputValue) {
        // Retrieve the existing input history
        chrome.storage.local.get(["inputHistory"], (result) => {
            const inputHistory = result.inputHistory || [];
            
            // Add the new input to the history
            inputHistory.push(inputValue);
            
            // Save the updated input history back to Chrome storage
            chrome.storage.local.set({ inputHistory }, () => {
                console.log("Input saved and history updated:", inputValue);
                userInput.value = ""; // Clear the input field
                displayMessage("Input saved!");
                
                // Update the display with the new input
                savedInputDisplay.textContent = `Saved input: ${inputValue}`;
                
                // Refresh the saved history display
                displaySavedHistory();
            });
        });
    }
});

// Save current tab URL to Chrome storage and display message
saveTabBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        const tabUrl = currentTab.url;

        chrome.storage.local.get(["tabUrls"], (result) => {
            const tabUrls = result.tabUrls || [];
            
            // Add the new tab URL to the history
            tabUrls.push(tabUrl);
            
            // Save the updated tab history back to Chrome storage
            chrome.storage.local.set({ tabUrls }, () => {
                console.log("Tab URL saved and history updated:", tabUrl);
                displayMessage("Tab URL saved!");
                
                // Refresh the saved history display
                displaySavedHistory();
            });
        });
    });
});

// Delete all saved data, display a message, and refresh history display
deleteAllBtn.addEventListener("click", () => {
    chrome.storage.local.clear(() => {
        console.log("All saved data cleared.");
        displayMessage("All data cleared!");
        savedInputDisplay.textContent = "Saved input: None";
        
        // Refresh the saved history display
        displaySavedHistory();
    });
});

// Call the function to display saved history when the popup opens
displaySavedHistory();
