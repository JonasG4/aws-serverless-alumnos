import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import createError from "http-errors";
import commondMiddleware from "../../lib/commondMiddleware";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const eliminarAlumno = async (event) => {
  const { id } = event.pathParameters;
  let isAlumnoExist;

  try {
    const alumno = await dynamo.send(
      new GetCommand({
        TableName: "AlumnosTable",
        Key: {
          id,
        },
      })
    );

    isAlumnoExist = alumno.Item;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  if (!isAlumnoExist) {
    const responseError = JSON.stringify({
      statusCode: 404,
      body: `Alumno con id: ${id} no encontrado`,
    });

    throw new createError.NotFound(responseError);
  }

  try {
    await dynamo.send(
      new DeleteCommand({
        TableName: "AlumnosTable",
        Key: {
          id,
        },
      })
    );
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ mesagge: "Alumno eliminado" }),
  };
};

export const handler = commondMiddleware(eliminarAlumno);