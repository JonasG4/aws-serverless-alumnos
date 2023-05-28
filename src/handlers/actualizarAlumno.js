import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import createError from "http-errors";
import commondMiddleware from "../../lib/commondMiddleware";
import validateAlumno from "../../lib/validations";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const actualizarAlumno = async (event) => {
  const { id } = event.pathParameters;
  const body = event.body;

  let isAlumnoExist, isAlumnoError;
  let alumno

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    alumno = await dynamo.send(
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
      headers,
      message: `Alumno con id: ${id} no existe`,
    });

    throw new createError.NotFound(responseError);
  }

  isAlumnoError = validateAlumno(body);

  if (isAlumnoError) {
    const responseError = JSON.stringify({
      statusCode: 400,
      errors: isAlumnoError,
    });

    throw new createError.BadRequest(responseError);
  }

  const updatedAt = new Date().toLocaleString();
  const createdAt = alumno.Item.createdAt;

  try {
    await dynamo.send(
      new UpdateCommand({
        TableName: "AlumnosTable",
        Key: {
          id,
        },
        UpdateExpression:
          "SET nombre = :nombre, apellido = :apellido, fechaNacimiento = :fechaNacimiento, sexo = :sexo, grupo = :grupo, promedioNota = :promedioNota, createdAt = :createdAt, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":nombre": body.nombre,
          ":apellido": body.apellido,
          ":fechaNacimiento": body.fechaNacimiento,
          ":sexo": body.sexo,
          ":grupo": body.grupo,
          ":promedioNota": body.promedioNota,
          ":createdAt": createdAt,
          ":updatedAt": updatedAt,
        },
        ReturnValues: "UPDATED_NEW",
      })
    );
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ mesagge: "Alumno actualizado correctamente" }),
  };
};

export const handler = commondMiddleware(actualizarAlumno);
