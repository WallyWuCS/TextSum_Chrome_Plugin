chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    // console.log("received the message");
    if (request.action === "extractText") {
      // console.log("start to extract text");
      const extractedText = extractText();
      sendResponse({ text: extractedText });
      return true;
    }
});


function extractText() {

  return document.body.innerText;  
}

