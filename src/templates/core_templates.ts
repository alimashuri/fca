//import * as changeCase from "change-case";

export function getCoreTemplate() {
  return `export 'error/error.dart';
export 'usecase/usecase.dart';
export 'network/network_info.dart';`;
}

export function getNetworkTemplate() {
  return `import 'package:internet_connection_checker/internet_connection_checker.dart';

abstract class NetworkInfo {
  Future<bool> get isConnected;
}

class NetworkInfoImpl implements NetworkInfo {
  final InternetConnectionChecker connectionChecker;

  NetworkInfoImpl(this.connectionChecker);

  @override
  Future<bool> get isConnected => connectionChecker.hasConnection;
}`;
}

export function getUsecaseTemplate() {
  return `import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';

import '../error/error.dart';

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

export function getErrorTemplate() {
  return `
export 'exceptions.dart';
export 'failure.dart';
`;
}

export function getExceptionTemplate() {
  return `
class ServerException implements Exception {
  String? message;

  ServerException(this.message);
}

class CacheException implements Exception {}`.trim();
}

export function getFailuresTemplate() {
  return `
import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  const Failure([List properties = const <dynamic>[]]);
}

class ServerFailure extends Failure {
  final String? message;

  const ServerFailure(this.message);

  @override
  List<Object?> get props => [message];
}

class NoDataFailure extends Failure {
  @override
  List<Object?> get props => [""];
}

class CacheFailure extends Failure {
  @override
  List<Object?> get props => [""];
}  
`.trim();
}

export function getFixtureReaderTemplate() {
  return `
import 'dart:io';
String fixture(String name) => File('test/fixtures/$name').readAsStringSync();
`.trim();
}