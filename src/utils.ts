import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import ignore from 'ignore';

export enum LogLevel {
  ERROR = 'Error',
  WARNING = 'Warning',
  INFO = 'Info',
  DEBUG = 'Debug'
}

// Array of rules to ignore
let rules = ignore ();

/**
 * Utility function that logs a message to the console with the specified log level.
 * 
 * @param {LogLevel} level - The log level of the message.
 * @param {string} message - The message to log.
 */
export function log(level: LogLevel, ...messages: string[]): void {
  console.log(`[${level}] ${messages.join(' ')}`);
}

/**
* Utility function that sets the state of `github.copilot.inlineSuggest.enable` to the specified
* boolean value.
*
* @param {boolean} state - The desired state of the `github.copilot.inlineSuggest.enable` setting.
* @return {Promise<void>} A promise that resolves once the update has completed.
*/
export async function setCopilotState(state: boolean): Promise<void> {
    log (LogLevel.INFO, `Setting Copilot state to ${state}`)
   
    const KEY = 'github.copilot.enable';
    const config = vscode.workspace.getConfiguration();

    let entries: Record<string, any> = { ...(config.get(KEY) || {}) };
    let adapted: Record<string, any> = {"*": state};

    for (const [k, v] of Object.entries(entries)) {
      if (k !== '*') {
        adapted[k] = state;
      }
    }

    log(LogLevel.DEBUG, `Adapted: ${JSON.stringify(adapted)}`)

    await config.update(KEY, adapted, vscode.ConfigurationTarget.Global);
}

/*!
 * Utility function that updates the state of Copilot based on the contents of the current workspace
 */
export async function updateCopilotState(): Promise<void> {

    log (LogLevel.DEBUG, 'Updating Copilot state')

    let disableCopilot = false;

    // Iterate over all current opened editors
    for (const editor of vscode.window.visibleTextEditors) {
      log(LogLevel.DEBUG, `Checking "${editor.document.uri.fsPath}"`);

      // Check if the file is in the ignore list
      if (rules.ignores(editor.document.uri.fsPath)) {
        log(LogLevel.DEBUG, `File "${editor.document.uri.fsPath}" is ignored`);
        disableCopilot = true;
      }
    }
    
    await setCopilotState(disableCopilot);
}

/*!
 * Utility function that reads the ignore rules based on the contents of the .copilotignore file
 */
export async function updateIgnoreList(): Promise<void> {

  log(LogLevel.DEBUG, 'Updating ignore list')

  rules = ignore ();

  if (vscode.workspace.workspaceFolders?.length) {
    await Promise.all(vscode.workspace.workspaceFolders.map(async (folder) => {
      const file = path.join(folder.uri.fsPath, '.copilotignore');
      if (fs.existsSync(file)) {
        const fileContent = fs.readFileSync(file, 'utf-8');
      for (const line of fileContent.split('\n')) {
          if (line.trim() !== '')
            rules.add(line.trim());
        }
      }
    }))
  }
}
