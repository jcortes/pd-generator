import { LLMChain, type BasePromptTemplate } from "langchain";
import { ZeroShotAgent, AgentExecutor } from "langchain/agents";
import { JsonToolkit } from "langchain/agents/toolkits";
import { ChatOpenAI } from "langchain/chat_models";
import { JsonSpec, type Tool } from "langchain/tools";

interface GetAgentArgs {
  prompt: BasePromptTemplate;
  allowedTools: string[];
};

function getTools(docs = {}) {
  const { tools } = new JsonToolkit(new JsonSpec(docs));
  return tools;
}

function getPrompt(tools: Tool[]) {
  return ZeroShotAgent.createPrompt(tools, {
    prefix: "This is a template for the agent:\n\n",
    suffix: "\n\nThis is the agent's response:\n\n",
    inputVariables: ["input", "agent_scratchpad"]
  });
}

function getAgent({ prompt, allowedTools }: GetAgentArgs) {
  const llm = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0,
    timeout: 300
  });

  return new ZeroShotAgent({
    llmChain: new LLMChain({ llm, prompt }),
    allowedTools
  });
}

function agentExecutor(input = "", docs = {}) {
  const tools = getTools(docs);
  const allowedTools = tools.map(({ name }) => name);
  const prompt = getPrompt(tools);
  const agent = getAgent({ prompt, allowedTools });

  const executor = AgentExecutor.fromAgentAndTools({
    agent,
    tools,
    verbose: true
  });

  return executor.run(input);
}

export {
  agentExecutor
};