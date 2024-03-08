const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const cors = require("cors");
const port = process.env.PORT || 3001;

const allowedOrigins = ["http://localhost:3000", "https://tuivastudio.com"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};


app.use(cors(corsOptions));
app.use(bodyParser.json());

const https = require("https");

// This function makes a POST request to the Telegram sendMessage API.
const sendMessageToTelegram = (message) => {
  console.log("MSG", message);
  const contact_number = message.contact || "NA";
  const type = message.type || "General";
  const botToken = "7055561460:AAHr_QDATKXLchY9yrwc99063J8WrcNO79c";
  const chatId = "-1002044681337";
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const textMessage = `------------------------- \n Contact number: ${contact_number} \n Regarding: ${type} \n -------------------------`;
  const data = JSON.stringify({
    chat_id: chatId,
    text: textMessage,
  });

  const url = new URL(telegramUrl);
  const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  const req = https.request(options, (res) => {
    let chunks = [];
    res.on("data", (chunk) => {
      chunks.push(chunk);
    });

    res.on("end", () => {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  req.on("error", (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  // Write data to request body
  req.write(data);
  req.end();
};

// Sample usage
app.post("/contact", (req, res) => {
  const data = req.body;
  console.log("Received data:", data);

  // Call the function to send a message to Telegram
  sendMessageToTelegram(data);

  res.status(200).send("Data received successfully.");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
