import * as changeCase from "change-case";

export function getBlocIndexTemplate(blocName: string, useEquatable: boolean): string {
  const snakeCaseBlocName = changeCase.snakeCase(blocName.toLowerCase());
  return `export '${snakeCaseBlocName}_bloc.dart';`;
}

export function getBlocTemplate(blocName: string, useEquatable: boolean): string {
  return useEquatable
    ? getEquatableBlocTemplate(blocName)
    : getDefaultBlocTemplate(blocName);
}

function getEquatableBlocTemplate(blocName: string) {
  const pascalCaseBlocName = changeCase.pascalCase(blocName.toLowerCase());
  const snakeCaseBlocName = changeCase.snakeCase(blocName.toLowerCase());
  const blocState = `${pascalCaseBlocName}State`;
  const blocEvent = `${pascalCaseBlocName}Event`;
  return `import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

part '${snakeCaseBlocName}_event.dart';
part '${snakeCaseBlocName}_state.dart';

class ${pascalCaseBlocName}Bloc extends Bloc<${blocEvent}, ${blocState}> {
  ${pascalCaseBlocName}Bloc() : super(${pascalCaseBlocName}Initial()) {
    on<${pascalCaseBlocName}Event>((event, emit) {
      // TODO: implement event handler
    });
  }
}
`;
}

function getDefaultBlocTemplate(blocName: string) {
  const pascalCaseBlocName = changeCase.pascalCase(blocName.toLowerCase());
  const snakeCaseBlocName = changeCase.snakeCase(blocName.toLowerCase());
  const blocState = `${pascalCaseBlocName}State`;
  const blocEvent = `${pascalCaseBlocName}Event`;
  return `import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

part '${snakeCaseBlocName}_event.dart';
part '${snakeCaseBlocName}_state.dart';

class ${pascalCaseBlocName}Bloc extends Bloc<${blocEvent}, ${blocState}> {
  ${pascalCaseBlocName}Bloc() : super(${pascalCaseBlocName}Initial());
    on<${pascalCaseBlocName}Event>((event, emit) {
      // TODO: implement event handler
    });
  }
}
`;
}