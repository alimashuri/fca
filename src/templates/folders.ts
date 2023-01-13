export function getFeatureFolders(): string[] {
  let list: string[] = [
    'data/datasources',
    'data/models',
    'data/repositories',
    'domain/entities',
    'domain/repositories',
    'domain/usecases',
    'presentation/bloc',
    'presentation/pages',
    'presentation/widgets'
  ];

  return list;
}

export function getSetUpFolders(): string[] {
  let list: string[] = [
    'core/error',
    'core/usecase',
    'core/network'
  ];

  return list;
}