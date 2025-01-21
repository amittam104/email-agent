'use server'

import { Composio } from "composio-core";
import OpenAI from "openai";
import { OpenAIToolSet } from "composio-core";
import { ComposioToolSet } from "composio-core";

// Use environment variables for API keys
const client = new Composio({ 
  apiKey: process.env.COMPOSIO_API_KEY 
});

const openai_client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


const toolset = new ComposioToolSet();


const composio_toolset = new OpenAIToolSet();

// Separate authentication function
export async function authenticateGithub() {
  try {
    const entity = await client.getEntity("default");
    const connection = await entity.initiateConnection({appName: 'github'});
    return connection.redirectUrl;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

export async function fetchAndPassGithubActions() {
  'use server'
  try {
    authenticateGithub()
    
    const tools = await composio_toolset.getTools({
      actions: ["github_star_a_repository_for_the_authenticated_user"],
    });
    
    const instruction = "Star the repo composiohq/composio on GitHub";
    
    const response = await openai_client.chat.completions.create({
      model: "gpt-4", // Fixed model name from "gpt-4o" to "gpt-4"
      messages: [{ role: "user", content: instruction }],
      tools: tools,
      tool_choice: "auto",
    });

    const result = await composio_toolset.handleToolCall(response);
    console.log('Tool execution result:', result);
    
    return result;
  } catch (error) {
    console.error('Error in fetchAndPassGithubActions:', error);
    throw error;
  }
}

export async function newConnection(){
  // Store connection parameters
const redirectURL = "http://localhost:3000"
const entityId = "amit" 

const connectionRequest = await toolset.connectedAccounts.initiate({
  appName: "gmail",
  redirectUri: redirectURL,
  entityId: entityId,
  authMode: "OAUTH2",
});
console.log(connectionRequest);

}

export async function checkConnection(){

  const connection = await toolset.connectedAccounts.get({
    connectedAccountId: "035c2033-9d8d-4aab-a50a-3d3e2e72e041"
  });
  console.log(connection.status);
}


export async function draftEmail() {
  'use server'
  try {

    const entity = await client.getEntity("amit");
    const connection = await entity.initiateConnection({appName: 'gmail'});
    console.log(connection.redirectUrl);
    
    const openai_client = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
    const composio_toolset = new OpenAIToolSet({
      apiKey: process.env.COMPOSIO_API_KEY 
      });

      const tools = await composio_toolset.getTools({
          actions: ["GMAIL_CREATE_EMAIL_DRAFT"]
      });


const instruction = "Create an email draft about connecting tomorrow, address it to Vaishnavi";

// Creating a chat completion request to the OpenAI model
const response = await openai_client.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{ role: "user", content: instruction }],
    tools: tools,
    tool_choice: "auto",
});

const tool_response = await composio_toolset.handleToolCall(response);

console.log(tool_response);
  } catch (error) {
    console.error('Error in fetchAndPassGithubActions:', error);
    throw error;
  }
}