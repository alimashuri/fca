import * as vscode from 'vscode';
import path = require("path");
import fs = require("fs");

import { getWorkspaceFolder } from './workspace_util';
import { getDevDependencies, getRequiredPackages } from '../templates';
import { getPackageVersion } from './pubdev_util';

export const getProjectName = (): string => {
  const pubspec = _loadPubspec();

  return pubspec.name;
};

export const addPackages = async (): Promise<void> => {
  let pubspec = _loadPubspec();
  // console.log('pubspec ' + pubspec);

  const packages = getRequiredPackages();
  const devDependencies = getDevDependencies();

  let updateRequired = false;

  for (let index = 0; index < packages.length; index++) {
    const packageName = packages[index];

    if (pubspec.dependencies[packageName] === undefined) {
      const version = await getPackageVersion(packageName);

      pubspec.dependencies[packageName] = '^' + version;
      updateRequired = true;
    }

  }

  for (let index = 0; index < devDependencies.length; index++) {
    const packageName = devDependencies[index];

    if (pubspec.dev_dependencies[packageName] === undefined) {
      const version = await getPackageVersion(packageName);

      pubspec.dev_dependencies[packageName] = '^' + version;
      updateRequired = true;
    }

  }

  if (updateRequired) {
    _replacePubspec(pubspec);
  }

};

function _loadPubspec(): any {
  const yaml = require('js-yaml');

  const pubspecPath = _pubspecPath();

  if (fs.existsSync(pubspecPath)) {
    return yaml.load(fs.readFileSync(pubspecPath, 'utf8'));
  }

  return vscode.window.showErrorMessage(
    "pubspec.yaml is missing."
  );
}

function _replacePubspec(data: any): void {
  const yaml = require('js-yaml');

  const pubspecPath = _pubspecPath();

  let yamlStr = yaml.dump(data);
  fs.writeFileSync(pubspecPath, yamlStr, 'utf8');
}

function _pubspecPath(): string {
  return path.join(getWorkspaceFolder(), "pubspec.yaml");
}
