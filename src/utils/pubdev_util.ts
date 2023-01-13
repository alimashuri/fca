export const getPackageVersion = async (packageName: string): Promise<string> => {
  const axios = require('axios');

  let response = await axios.get('https://pub.dev/api/packages/' + packageName);

  return response.data.latest.version;;
};