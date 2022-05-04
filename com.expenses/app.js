const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    switch (event.routeKey) {
      case "DELETE /expenses/{id}":
        await dynamo
            .delete({
              TableName: "expense-history",
              Key: {
                id: event.pathParameters.id
              }
            })
            .promise();
        body = `Deleted item ${event.pathParameters.id}`;
        break;
      case "GET /expenses/{id}":
        body = await dynamo
            .get({
              TableName: "expense-history",
              Key: {
                id: event.pathParameters.id
              }
            })
            .promise();
        break;
      case "GET /expenses":
        body = await dynamo.scan({ TableName: "expense-history" }).promise();
        break;
      case "PUT /expenses":
        let requestJSON = JSON.parse(event.body);
        await dynamo
            .put({
              TableName: "expense-history",
              Item: {
                id: requestJSON.id,
                category: requestJSON.category,
                description: requestJSON.description,
                amount: requestJSON.amount,
                currency: requestJSON.currency,
                date: requestJSON.date,

              }
            })
            .promise();
        body = `Put item ${requestJSON.id}`;
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};