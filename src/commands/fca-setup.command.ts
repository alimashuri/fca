import { window, workspace } from "vscode";
import * as _ from "lodash";
import * as path from "path";
import { getWorkspaceFolder } from "../utils/workspace_util";
import { getSetUpFolders } from "../templates/folders";
import { getCoreTemplate, getErrorTemplate, getExceptionTemplate, getFailuresTemplate, getFixtureReaderTemplate, getNetworkTemplate, getUsecaseTemplate } from "../templates";
import { createDirectories, createFileTemplate } from "../utils";
import { addPackages } from "../utils/flutter_project_util";

export async function setUpProject() {
    if (workspace.workspaceFolders !== undefined) {

        const wsPath = getWorkspaceFolder();
        const targetCoreDirectory = path.join(wsPath, 'lib/');
        const targetTestDirectory = path.join(wsPath, 'test/');

        // Create core folders
        await createDirectories(targetCoreDirectory, getSetUpFolders());
        await createDirectories(targetTestDirectory, getSetUpFolders());
        await createDirectories(targetTestDirectory, ['fixtures']);

        // Add core templates
        createFileTemplate('core', `${targetCoreDirectory}/core`, getCoreTemplate());
        createFileTemplate('usecase', `${targetCoreDirectory}/core/usecase`, getUsecaseTemplate());
        createFileTemplate('failure', `${targetCoreDirectory}/core/error`, getFailuresTemplate());
        createFileTemplate('exceptions', `${targetCoreDirectory}/core/error`, getExceptionTemplate());
        createFileTemplate('error', `${targetCoreDirectory}/core/error`, getErrorTemplate());
        createFileTemplate('network_info', `${targetCoreDirectory}/core/network`, getNetworkTemplate());
        createFileTemplate('fixture_reader', `${targetTestDirectory}/fixtures`, getFixtureReaderTemplate());

        //This will add any required dart packages
        addPackages();

        window.showInformationMessage(
            `Successfully Setup Core Flutter Clean Architecture`
        );
    } else {
        window.showErrorMessage("No project opened, please open project first.");
        return null;
    }
}
