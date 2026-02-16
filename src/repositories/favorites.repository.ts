import { pool } from '../utils/db';

export class FavoritesRepository {
  async getFavorites(page: number = 1, limit: number = 10) {
    try {
      const offset = (page - 1) * limit;

      console.log('[FavoritesRepository] Ejecutando query con:', { page, limit, offset });

      // Consulta con paginación para MariaDB - Asegurando enteros
      // Nota: mysql2 prefiere que los valores de LIMIT/OFFSET sean números directos en la query string si la parametrización falla
      // Pero intentaremos la parametrización estándar primero asegurando tipos
      const query = 'SELECT * FROM favorites ORDER BY created_at DESC LIMIT ? OFFSET ?';
      const [rows] = await pool.query(query, [Number(limit), Number(offset)]);

      // También obtenemos el total para que el frontend sepa cuántas páginas hay
      const [total]: any = await pool.query('SELECT COUNT(*) as count FROM favorites');

      console.log('[FavoritesRepository] ✓ Query exitosa:', {
        rowsCount: Array.isArray(rows) ? rows.length : 0,
        total: total[0].count
      });

      return {
        data: rows,
        total: total[0].count,
        page,
        limit
      };
    } catch (error) {
      console.error('[FavoritesRepository] ✗ Error en query:', error);
      throw error;
    }
  }
}