export const formatResponse = (statusCode: number, body: any) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      // Estas cabeceras son vitales para que tu aplicación React no bloquee la petición
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      // Prevenir cacheo de respuestas
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    body: JSON.stringify(body),
  };
};