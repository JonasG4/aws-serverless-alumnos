export default (alumno) => {
  let errors = [];

  if (!alumno.nombre || alumno.nombre.trim().length < 2) {
    errors.push("El nombre debe tener al menos 2 carácteres");
  }

  if (!alumno.apellido || alumno.apellido.trim().length < 2) {
    errors.push("El apellido debe tener al menos 2 carácteres");
  }

  if (alumno.fechaNacimiento) {
    const fechaNacimiento = new Date(alumno.fechaNacimiento);
    const hoy = new Date();

    if (fechaNacimiento > hoy) {
      errors.fechaNacimiento = errors.push(
        "La fecha de nacimiento no puede ser mayor a la fecha actual"
      );
    }
  } else {
    errors.push("La fecha de nacimiento es requerida");
  }

  if (!alumno.sexo || alumno.sexo.trim() === "") {
    errors.push("El sexo es requerido");
  }

  if (!alumno.grupo || alumno.grupo.trim() === "") {
    errors.push("El grupo es requerido");
  }

  if (!alumno.promedioNota) {
    errors.push("El promedio es requerido");
  } else if (typeof alumno.promedioNota !== "number") {
    errors.push("El promedio debe ser un número");
  }

  if (errors.length > 0) {
    return errors;
  }

  return null;
};
