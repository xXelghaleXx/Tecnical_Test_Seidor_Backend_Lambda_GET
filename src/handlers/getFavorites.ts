import { APIGatewayProxyHandler } from 'aws-lambda';
import { FavoritesRepository } from '../repositories/favorites.repository';
import { formatResponse } from '../utils/response';

const favRepo = new FavoritesRepository();

export const handler: APIGatewayProxyHandler = async (event) => {
  const page = parseInt(event.queryStringParameters?.page || '1');
  // Frontend envía pageSize, pero mantenemos soporte para limit también
  const limit = parseInt(event.queryStringParameters?.pageSize || event.queryStringParameters?.limit || '10');

  console.log('[getFavorites] 📥 Parámetros recibidos:', { page, limit });

  try {
    const data = await favRepo.getFavorites(page, limit);
    console.log('[getFavorites] ✓ Datos obtenidos exitosamente:', {
      total: data.total,
      dataLength: Array.isArray(data.data) ? data.data.length : 0
    });
    return formatResponse(200, data);
  } catch (error) {
    console.error('[getFavorites] ✗ Error al leer la base de datos:', error);
    return formatResponse(500, {
      message: 'Error al leer la base de datos',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
};