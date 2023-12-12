const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");

let userMessage;
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;
const inputInitWidth = chatInput.scrollWidth;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}
const generateResponse = (incomingChatLI) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLI.querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage}]
        })
    }
    
    //Send POST request to API, get response 
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        // messageElement.classList.add(error);
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0,chatbox.scrollHeight));
}
const handleChat = () => {
    userMessage = chatInput.value.trim();
    console.log(userMessage);
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    //Appends the user message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight);

    setTimeout(() => {
        //Display "Thinking..." message while waiting for the response
        const incomingChatLI = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLI);
        chatbox.scrollTo(0,chatbox.scrollHeight);
        generateResponse(incomingChatLI);
    }, 600);
}
chatInput.addEventListener("input", () => {
    //Adjust the height of the input textarea based on its content
    chatInput.style.width = `${inputInitWidth}px`;
    chatInput.style.width = `${chatInput.scrollWidth}px`;
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    //If enter key is pressed without shift key and the window 
    //width is greater than than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
});
const chatbotToggler = document.querySelector(".chatbot-toggler");
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
sendChatBtn.addEventListener("click", handleChat);

// Function to handle copying text when the "Copy" button is clicked
function handleCopyButtonClick(event) {
    const chatMessage = event.target.previousElementSibling; // Get the chat message text
    const textToCopy = chatMessage.textContent;
  
    // Create a temporary textarea element to facilitate copying
    const textarea = document.createElement("textarea");
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
  
    // Select and copy the text
    textarea.select();
    document.execCommand("copy");
  
    // Clean up
    document.body.removeChild(textarea);
  }
  
  // Attach event listeners to all "Copy" buttons
  const copyButtons = document.querySelectorAll(".copy-button");
  copyButtons.forEach((button) => {
    button.addEventListener("click", handleCopyButtonClick);
  });
  