import axios, { AxiosError } from 'axios';

export class SwapiService {
  private readonly baseUrl = 'https://swapi.dev/api/people';
  private readonly timeout = 10000; // 10 segundos
  private readonly maxRetries = 3;

  async getCharacters(page: string = '1', search?: string) {
    const params = {
      page,
      ...(search && { search })
    };

    // Retry logic con backoff exponencial
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`[SWAPI] Intento ${attempt}/${this.maxRetries} - URL: ${this.baseUrl}`, params);
        
        const response = await axios.get(this.baseUrl, { 
          params,
          timeout: this.timeout,
          headers: {
            'User-Agent': 'AWS-Lambda-SWAPI-Client',
            'Accept': 'application/json'
          }
        });

        console.log(`[SWAPI] ✓ Respuesta exitosa en intento ${attempt}`, {
          count: response.data?.count,
          resultsLength: response.data?.results?.length
        });
        
        return response.data;
        
      } catch (error) {
        const axiosError = error as AxiosError;
        
        console.error(`[SWAPI] ✗ Error en intento ${attempt}/${this.maxRetries}:`, {
          message: axiosError.message,
          code: axiosError.code,
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          url: axiosError.config?.url,
          timeout: axiosError.code === 'ECONNABORTED'
        });

        // Si es el último intento, lanzar el error con información detallada
        if (attempt === this.maxRetries) {
          throw new Error(
            `SWAPI connection failed after ${this.maxRetries} attempts. ` +
            `Last error: ${axiosError.message} (${axiosError.code || 'UNKNOWN'})`
          );
        }

        // Esperar antes de reintentar (backoff exponencial: 1s, 2s, 3s)
        const waitTime = 1000 * attempt;
        console.log(`[SWAPI] Esperando ${waitTime}ms antes de reintentar...`);
        await this.sleep(waitTime);
      }
    }

    // Este punto nunca debería alcanzarse, pero TypeScript lo requiere
    throw new Error('SWAPI connection failed unexpectedly');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}