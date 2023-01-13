import * as _ from "lodash";
import {
	commands,
	ExtensionContext,
} from "vscode";
import { analyzeDependencies } from "./utils";
import { newFeatureBloc, newFeatureCubit, setUpProject } from "./commands";

export function activate(_context: ExtensionContext) {
	analyzeDependencies();

	_context.subscriptions.push(
		commands.registerCommand("extension.setup_fca", setUpProject),
		commands.registerCommand("extension.new_feature_bloc", newFeatureBloc),
		commands.registerCommand("extension.new_feature_cubit", newFeatureCubit),
	);

}