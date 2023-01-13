export function getCoreTemplate() {

}

export function getUsecaseTemplate() {
    return `import 'package:dartz/dartz.dart';
  import 'package:equatable/equatable.dart';
  
  import '../error/failures.dart';
  
  // Parameters have to be put into a container object so that they can be
  // included in this abstract base class method definition.
  abstract class UseCase<Type, Params> {
    Future<Either<Failure, Type>> call(Params params);
  }
  
  // This will be used by the code calling the use case whenever the use case
  // doesn't accept any parameters.
  class NoParams extends Equatable {
    @override
    List<Object> get props => [];
  }
  `;
  }
  
  export function getFailuresTemplate() {
    return `import 'package:equatable/equatable.dart';
  
  abstract class Failure extends Equatable {
    // If the subclasses have some properties, they'll get passed to this constructor
    // so that Equatable can perform value comparison.
    Failure();
  }
  `;
  }
  
  export function getFixtureReaderTemplate() {
    return `import 'dart:io';
  
  String fixture(String name) => File('test/fixtures/$name').readAsStringSync();
  `;
  }
  