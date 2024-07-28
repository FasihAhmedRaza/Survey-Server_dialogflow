// import { WebhooksClient } from '@google-cloud/dialogflow-cx';
const { WebhookClient } = require("dialogflow-fulfillment");
const express = require("express");
const { json } = require("express");
const cors = require("cors");
const axios = require('axios');
require('dotenv').config();
OPENAI_API_KEY = "sk-proj-m9bocyHn06eRW8kcjVVcT3BlbkFJNUE0IF5dlzwYZ0mNUGKg"
const app = express();
app.use(json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello world");
});

// Webhook fulfillment handler
app.post('/webhook', async (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });
  let intentMap = new Map();
  intentMap.set('hi', hi);
  intentMap.set('Default Fallback Intent', queryGPT);

  agent.handleRequest(intentMap);

  // hi ( welcome intent )
  function hi(agent) {
    console.log(`intent => hi`);
    agent.add("Hi, this is a Dialogflow  serverresponse.");
  }

  // Function to handle Default Fallback Intent
  async function queryGPT(agent) {
    let query = agent.query;

    const data = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant."
        },
        {
          role: "user",
          content: `${query}`
        }
      ]
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    };

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', data, config);
      agent.add(`${response.data?.choices[0]?.message?.content}`);
      console.log('got a response')
      // console.log(`OpenAI API Key: ${OPENAI_API_KEY}`);
      // Handle response data
    } catch (error) {
      agent.add("Something went wrong!")
      console.log(error?.response?.data)
      // console.log(`OpenAI API Key: ${OPENAI_API_KEY}`);
      // Handle error
    };
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
