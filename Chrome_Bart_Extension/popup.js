// // Listen for clicking the extract_text button
// document.getElementById("extract-text").addEventListener("click", () => {
//   console.log("try sending message to listen");
//   chrome.runtime.sendMessage({ action: "extractText" }, (response) => {
//     const extractedContentElement = document.getElementById("extracted-content");
//     extractedContentElement.textContent = "didnot get response";
//     extractedContentElement.textContent = response.text;
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  const extractTextButton = document.getElementById("extract-text");
  const summarizeButton = document.getElementById("summarize");
  const extractedContentElement = document.getElementById("extracted-content");
  const summaryElement = document.getElementById("summary");
  let summ_text = "Summarization not working :("

  extractTextButton.addEventListener("click", () => {
    console.log("Trying to send a message to content.js");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Add a delay of 100ms before sending the message
      setTimeout(() => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "extractText" }, function (response) {
          console.log("Received response from content.js");
          if (response && response.text) {
            extractedContentElement.textContent = "text captured:)";
            summ_text = response.text;
          } else {
            extractedContentElement.textContent = "No response received.";
          }
        });
      }, 100);
    });
  });

  summarizeButton.addEventListener("click", () => {
      summarize(summ_text);
  });
});


function summarize(text) {
  const summaryElement = document.getElementById("summary");
  summaryElement.textContent = "Summarizing...";
  console.log("start summarizing")
  // Call backend server's API endpoint with the extracted text
  fetch("http://127.0.0.1:5000/api/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text }),
  })
    .then((response) => response.json())
    .then((data) => {
      summaryElement.textContent = data.summary;
    })
    .catch((error) => {
      console.error("Error:", error);
      summaryElement.textContent = "An error occurred.";
    });
}

