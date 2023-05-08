import * as vscode from "vscode";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import * as fs from "fs";

dotenv.config();
const apiKey = process.env.OPENAI_API_KEY;
const model = "text-davinci-003";
const configuration = new Configuration({
  organization: "org-ZV6H4W0LcDT3Ayjc8GHoXC7j",
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.chat",
    async () => {
      const userInput = await vscode.window.showInputBox({
        prompt: "Type your message",
      });

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: userInput,
        temperature: 0,
        max_tokens: 2048,
        echo: true,
        top_p: 1.0,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      createAndWriteToFile(response.data.choices[0].text);
    }
  );
  function createAndWriteToFile(data: any) {
    // get the workspace root path
    const workspaceRootPath = vscode.workspace.rootPath;

    if (workspaceRootPath) {
      // create a file path
      const filePath = `${workspaceRootPath}/example.tsx`;

      // create file and write data
      fs.writeFile(filePath, data, (err) => {
        if (err) {
          vscode.window.showErrorMessage(
            `Error writing to file: ${err.message}`
          );
        } else {
          vscode.window.showInformationMessage(
            `File created and data written to it at ${filePath}`
          );
        }
      });
    }
  }
  context.subscriptions.push(disposable);
}
