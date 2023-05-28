import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";
import creatError from "http-errors";
//libs
import commondMiddleware from "../../lib/commondMiddleware";
import validateAlumno from "../../lib/validations";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const crearAlumno = async (event) => {
  const alumno = event.body;
  let newAlumno;

  // Validar alumno
  const isAlumnoError = validateAlumno(alumno);

  if (isAlumnoError) {
    const responseError = JSON.stringify({
      statusCode: 400,
      errors: isAlumnoError,
    });

    throw new creatError.BadRequest(responseError);
  }

  try {
    newAlumno = {
      ...alumno,
      id: uuid(),
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    };

    await dynamo.send(
      new PutCommand({
        TableName: "AlumnosTable",
        Item: newAlumno,
      })
    );
  } catch (error) {
    throw new creatError.InternalServerError(error);
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify(newAlumno),
  };
};

export const handler = commondMiddleware(crearAlumno);
