import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import createError from "http-errors";
import commondMiddleware from "../../lib/commondMiddleware";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const obtenerAlumno = async (event) => {
  const { id } = event.pathParameters;
  let alumno, isAlumnoExist;

  try {
    const { Item } = await dynamo.send(
      new GetCommand({
        TableName: "AlumnosTable",
        Key: {
          id,
        },
      })
    );

    isAlumnoExist = Item; 
    alumno = Item;
    
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  if (!isAlumnoExist) {
    const responseError = JSON.stringify({
      statusCode: 404,
      body: `Alumno con id: ${id} no se ha encontrado`,
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
    body: JSON.stringify(alumno),
  };
};

export const handler = commondMiddleware(obtenerAlumno);
