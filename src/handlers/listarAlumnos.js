import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import commondMiddleware from "../../lib/commondMiddleware";
import createError from "http-errors";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const listarAlumnos = async () => {
  let alumnos;

  try {
    const { Items } = await dynamo.send(
      new ScanCommand({
        TableName: "AlumnosTable",
      })
    );

    alumnos = Items;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  if (!alumnos) {
    const responseError = JSON.stringify({
      statusCode: 404,
      body: "No se encontraron alumnos",
    });
    
    throw new createError.NotFound(responseError);
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      cantidad: alumnos.length,
      alumnos: alumnos,
    }),
  };
};

export const handler = commondMiddleware(listarAlumnos);
