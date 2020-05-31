
const config = {
    endpoint: "https://businesstrustdb.documents.azure.com:443/",
    key: "RhCaDWk8uk6arpG6AJxzJZaJgtn4D6cWjPj1nIQwXlJXOBxf5DcVkuF5XjEh6Bph7pe1qBp1hys5opk2XBBt4A==",
    databaseId: "healthStat",
    containerId: "Employee",
    partitionKey: { kind: "Hash", paths: ["/EmpId"] }
  };
  
  module.exports = config;