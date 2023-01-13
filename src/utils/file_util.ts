import * as _ from "lodash";
import * as changeCase from "change-case";
import { existsSync, lstatSync, writeFile } from "fs";
import path = require("path");
import mkdirp = require("mkdirp");
import { OpenDialogOptions, Uri, window, workspace } from "vscode";
import { getWorkspaceFolder } from "./workspace_util";

export function isNameValid(featureName: string | undefined): boolean {
  // Check if feature name exists
  if (!featureName) {
    return false;
  }
  // Check if feature name is null or white space
  if (_.isNil(featureName) || featureName.trim() === "") {
    return false;
  }

  // Return true if feature name is valid
  return true;
}

export function createFileTemplate(
  fileName: string,
  targetDirectory: string,
  content: string
) {
  const snakeCaseBlocName = changeCase.snakeCase(fileName.toLowerCase());
  const targetPath = `${targetDirectory}/${snakeCaseBlocName}.dart`;
  // console.log('createFileTemplate ' + targetPath);
  if (existsSync(targetPath)) {
    throw Error(`${snakeCaseBlocName} already exists`);
  }
  return new Promise(async (resolve, reject) => {
    writeFile(
      targetPath,
      content,
      "utf8",
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(true);
      }
    );
  });
}

export async function createDirectories(
  targetDirectory: string,
  childDirectories: string[]
): Promise<void> {
  // Create the parent directory
  await createDirectory(targetDirectory);
  // Creat the children
  childDirectories.map(
    async (directory) =>
      await createDirectory(path.join(targetDirectory, directory))
  );
}

export function createDirectory(targetDirectory: string): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdirp(targetDirectory, (error: any) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

export async function getTargetDirectory(): Promise<string> {
  let targetDirectory;

  targetDirectory = await createTargetDirectory();

  if (_.isNil(targetDirectory)) {
    throw Error("Please select a valid directory");
  }

  return targetDirectory;
}

export async function createTargetDirectory(): Promise<string | undefined> {
  if (workspace.workspaceFolders !== undefined) {

    const wsPath = getWorkspaceFolder();

    const targetDirectory = path.join(wsPath, 'lib/features/');
    if (!existsSync(targetDirectory)) {
      await createDirectory(targetDirectory);
    }
    return targetDirectory;

  }
  return undefined;
}

export async function promptForTargetDirectory(): Promise<string | undefined> {
  const options: OpenDialogOptions = {
    canSelectMany: false,
    openLabel: "Select a folder to create the feature in",
    canSelectFolders: true,
  };

  return window.showOpenDialog(options).then((uri) => {
    if (_.isNil(uri) || _.isEmpty(uri)) {
      return undefined;
    }
    return uri[0].fsPath;
  });
}