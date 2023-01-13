import * as vscode from 'vscode';

export const getWorkspaceFolder = (): string => {
  const folders = vscode.workspace.workspaceFolders;

  if (folders === undefined) {
    return '';
  }

  const folder = folders[0] || {};
  const uri = folder.uri;

  return uri.fsPath;
};