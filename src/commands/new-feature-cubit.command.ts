import { Uri } from "vscode";
import {
    newFeature
} from "./new-feature.command";

export const newFeatureCubit = async (uri: Uri) => {
    await newFeature(false);
};
