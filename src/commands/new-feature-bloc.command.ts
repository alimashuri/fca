import { Uri } from "vscode";
import {
    newFeature
} from "./new-feature.command";

export const newFeatureBloc = async (uri: Uri) => {
    await newFeature(true);
};
