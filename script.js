const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", async () => {
  const question = userInput.value;
  if (!question) return;

  appendMessage("You", question);
  userInput.value = "";

  appendMessage("Assistant", "Thinking...");

  try {
    const res = await fetch("/.netlify/functions/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });
    const data = await res.json();
    updateLastMessage("Assistant", data.answer);
  } catch (err) {
    updateLastMessage("Assistant", "Error contacting AI.");
    console.error(err);
  }
});

function appendMessage(sender, message) {
  const div = document.createElement("div");
  div.textContent = `${sender}: ${message}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function updateLastMessage(sender, message) {
  const last = chatBox.lastChild;
  if (last) last.textContent = `${sender}: ${message}`;
}
