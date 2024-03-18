import * as vscode from 'vscode';
import * as utils from './utils';
import { LogLevel } from './utils';

const IGNORE_FILE_NAME = '.copilotignore';

/**
 * This method is called when the extension is activated.
 * 
 * @param {vscode.ExtensionContext} context - The context in which the extension is activated.
 */
export function activate(context: vscode.ExtensionContext) {

  utils.log (LogLevel.INFO, 'Extension activated');

  //
  // Commands
  //
  context.subscriptions.push (vscode.commands.registerCommand('disable-copilot-on-tag.enable', async () => {
    utils.log (LogLevel.DEBUG, 'Enable copilot');
    await utils.setCopilotState(true);
  }));

  context.subscriptions.push (vscode.commands.registerCommand('disable-copilot-on-tag.disable', async () => {
    utils.log (LogLevel.DEBUG, 'Disable copilot');
    await utils.setCopilotState(false);
  }));

  context.subscriptions.push (vscode.commands.registerCommand('disable-copilot-on-tag.about', () => {
    utils.log (LogLevel.DEBUG, 'Show about message');
    vscode.window.showInformationMessage('About Copilot Disabler');
  }));

  //
  // Event listeners for rule definition changes
  //
  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      utils.log(LogLevel.DEBUG, 'Workspace folders changed');
      utils.updateIgnoreList ();
  }));

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((file: vscode.TextDocument) => {
      if (file.fileName.endsWith(IGNORE_FILE_NAME)) {
        utils.log(LogLevel.DEBUG, 'Ignore file saved');
        utils.updateIgnoreList ();
      }
  }));

  context.subscriptions.push(
    vscode.workspace.onDidDeleteFiles((fileDeleteEvent: vscode.FileDeleteEvent) => {
      if (fileDeleteEvent.files.find(file => file.path.endsWith(IGNORE_FILE_NAME))) {
        utils.log(LogLevel.DEBUG, 'Ignore file deleted');
        utils.updateIgnoreList ();
      }
  }));

  context.subscriptions.push(
    vscode.workspace.onDidRenameFiles(() => {
      utils.log(LogLevel.DEBUG, 'File renamed');
      utils.updateIgnoreList ();
  }));

  //
  // Event listeners for editor changes
  //
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      utils.log(LogLevel.DEBUG, 'Active editor changed');
      utils.updateCopilotState();
  }));

  context.subscriptions.push(
    vscode.window.onDidChangeVisibleTextEditors(() => {
      utils.log(LogLevel.DEBUG, 'Visible editors changed');
      utils.updateCopilotState();
  }));
 
}

/**
 * This method is called when the extension is deactivated.
 */
export function deactivate() {
  utils.log (LogLevel.INFO, 'Extension deactivated');
}
