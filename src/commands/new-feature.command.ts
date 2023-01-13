import * as _ from "lodash";
import * as path from "path";
import * as changeCase from "change-case";
import { existsSync } from "fs";
import { InputBoxOptions, QuickPickOptions, window, workspace } from "vscode";
import {
    getBlocEventTemplate,
    getBlocIndexTemplate,
    getBlocStateTemplate,
    getBlocTemplate,
    getCubitStateTemplate,
    getCubitTemplate,
} from "../templates";
import { createDirectories, createDirectory, createFileTemplate, getTargetDirectory, getWorkspaceFolder, isNameValid } from "../utils";

export async function newFeature(useCubit: boolean) {
    if (workspace.workspaceFolders !== undefined) {

        // Show feature prompt
        let featureName = await promptForFeatureName();

        // Abort if name is not valid
        if (!isNameValid(featureName)) {
            window.showErrorMessage("The name must not be empty");
            return;
        }
        featureName = `${featureName}`;


        const useEquatable = true;

        const pascalCaseFeatureName = changeCase.pascalCase(
            featureName.toLowerCase()
        );
        try {
            await generateFeatureArchitecture(
                `${featureName}`,
                useEquatable,
                useCubit
            );
            window.showInformationMessage(
                `Successfully Generated ${pascalCaseFeatureName} Feature`
            );
        } catch (error) {
            window.showErrorMessage(
                `Error:
            ${error instanceof Error ? error.message : JSON.stringify(error)}`
            );
        }
    } else {
        window.showErrorMessage("No project opened, please open project first.");
        return null;
    }
}

async function generateFeatureArchitecture(
    featureName: string,
    useEquatable: boolean,
    useCubit: boolean
) {

    let targetDirectory = "";
    try {
        targetDirectory = await getTargetDirectory();
    } catch (error) {
        window.showErrorMessage((error instanceof Error) ? error.message : "Error");
    }

    // Create the features directory if its does not exist yet
    const featuresDirectoryPath = getFeaturesDirectoryPath(targetDirectory);
    if (!existsSync(featuresDirectoryPath)) {
        await createDirectory(featuresDirectoryPath);
    }

    // Use Test
    const includeTest = await promptForIncludeFeatureTest();
    // console.log('include test ' + includeTest);

    // Create the feature directory
    const featureDirectoryPath = path.join(targetDirectory, featureName);
    await _createDirectory(featureDirectoryPath, useCubit);

    if (includeTest) {
        const _wsDir = getWorkspaceFolder();
        const testDir = path.join(_wsDir, `test/features/${featureName}`);
        // console.log('include test ' + testDir);

        await _createDirectory(testDir, useCubit);
    }


    // Create the presentation layer
    const presentationDirectoryPath = path.join(
        featureDirectoryPath,
        "presentation"
    );

    // Generate the bloc code in the presentation layer
    useCubit
        ? await generateCubitCode(featureName, presentationDirectoryPath, useEquatable, includeTest)
        : await generateBlocCode(featureName, presentationDirectoryPath, useEquatable, includeTest);
}

function getFeaturesDirectoryPath(currentDirectory: string): string {
    // Split the path
    const splitPath = currentDirectory.split(path.sep);

    // Remove trailing \
    if (splitPath[splitPath.length - 1] === "") {
        splitPath.pop();
    }

    // Rebuild path
    const result = splitPath.join(path.sep);

    // Determines whether we're already in the features directory or not
    const isDirectoryAlreadyFeatures =
        splitPath[splitPath.length - 1] === "features";

    // If already return the current directory if not, return the current directory with the /features append to it
    return isDirectoryAlreadyFeatures ? result : path.join(result, "features");
}

async function _createDirectory(
    featureDirectoryPath: string,
    useCubit: boolean
) {

    if (!existsSync(featureDirectoryPath)) {
        await createDirectory(featureDirectoryPath);
    }
    // Create the data layer
    const dataDirectoryPath = path.join(featureDirectoryPath, "data");
    await createDirectories(dataDirectoryPath, [
        "datasources",
        "models",
        "repositories",
    ]);

    // Create the domain layer
    const domainDirectoryPath = path.join(featureDirectoryPath, "domain");
    await createDirectories(domainDirectoryPath, [
        "entities",
        "repositories",
        "usecases",
    ]);

    // Create the presentation layer
    const presentationDirectoryPath = path.join(
        featureDirectoryPath,
        "presentation"
    );

    await createDirectories(presentationDirectoryPath, [
        useCubit ? "cubit" : "bloc",
        "pages",
        "widgets",
    ]);

}

function promptForFeatureName(): Thenable<string | undefined> {
    const blocNamePromptOptions: InputBoxOptions = {
        prompt: "Feature Name",
        placeHolder: "counter",
    };
    return window.showInputBox(blocNamePromptOptions);
}

async function promptForIncludeFeatureTest(): Promise<boolean> {
    const useEquatablePromptValues: string[] = ["yes", "no"];
    const useEquatablePromptOptions: QuickPickOptions = {
        placeHolder:
            "Do you want to generate test folder?",
        canPickMany: false,
    };

    const answer = await window.showQuickPick(
        useEquatablePromptValues,
        useEquatablePromptOptions
    );

    return answer === "yes";
}

async function generateBlocCode(
    blocName: string,
    targetDirectory: string,
    useEquatable: boolean,
    useTest: boolean
) {
    const blocDirectoryPath = `${targetDirectory}/bloc`;
    if (!existsSync(blocDirectoryPath)) {
        await createDirectory(blocDirectoryPath);
    }

    await Promise.all([
        createFileTemplate(`bloc`, blocDirectoryPath, getBlocIndexTemplate(blocName, useEquatable)),
        createFileTemplate(`${blocName}_bloc`, blocDirectoryPath, getBlocTemplate(blocName, useEquatable)),
        createFileTemplate(`${blocName}_event`, blocDirectoryPath, getBlocEventTemplate(blocName, useEquatable)),
        createFileTemplate(`${blocName}_state`, blocDirectoryPath, getBlocStateTemplate(blocName, useEquatable)),
    ]);
}

async function generateCubitCode(
    blocName: string,
    targetDirectory: string,
    useEquatable: boolean,
    useTest: boolean
) {
    const blocDirectoryPath = `${targetDirectory}/cubit`;
    if (!existsSync(blocDirectoryPath)) {
        await createDirectory(blocDirectoryPath);
    }

    await Promise.all([
        createFileTemplate(`${blocName}_cubit`, blocDirectoryPath, getCubitTemplate(blocName, useEquatable)),
        createFileTemplate(`${blocName}_state`, blocDirectoryPath, getCubitStateTemplate(blocName, useEquatable)),
    ]);
}