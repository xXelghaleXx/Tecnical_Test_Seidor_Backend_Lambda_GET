import { APIGatewayProxyHandler } from 'aws-lambda';
import { SwapiService } from '../services/swapi.service';
import { formatResponse } from '../utils/response';

const swapiService = new SwapiService();

export const handler: APIGatewayProxyHandler = async (event) => {
  // Extraemos parámetros de la URL: ?page=2&search=luke
  const page = event.queryStringParameters?.page || '1';
  const search = event.queryStringParameters?.search;

  console.log('[getPeople] 📥 Parámetros recibidos:', { page, search });

  try {
    const data = await swapiService.getCharacters(page, search);
    console.log('[getPeople] ✓ Datos obtenidos exitosamente');

    // Transformar la respuesta de SWAPI para que coincida con el formato esperado por el frontend
    const transformedData = {
      total: data.count,
      next: data.next,
      previous: data.previous,
      characters: data.results.map((character: any, index: number) => {
        // Extraer ID de la URL (ej: "https://swapi.dev/api/people/1/" -> "1")
        const urlParts = character.url.split('/');
        const id = urlParts[urlParts.length - 2];

        return {
          id,
          name: character.name,
          height: character.height,
          mass: character.mass,
          hair_color: character.hair_color,
          skin_color: character.skin_color,
          eye_color: character.eye_color,
          birth_year: character.birth_year,
          gender: character.gender
        };
      })
    };

    return formatResponse(200, transformedData);
  } catch (error) {
    console.error('[getPeople] ✗ Error:', error);
    return formatResponse(500, {
      message: 'Error al conectar con SWAPI',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
};