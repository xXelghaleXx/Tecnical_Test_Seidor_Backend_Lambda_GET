/// <reference types="jest" />
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

// 1. Definir el mock function FUERA del jest.mock para poder usarlo
const mockGetCharacters = jest.fn();

// 2. Mockear el servicio usando factory parameter
jest.mock('../../src/services/swapi.service', () => {
    return {
        SwapiService: jest.fn().mockImplementation(() => {
            return {
                getCharacters: mockGetCharacters, // Retorna nuestro mock function
            };
        }),
    };
});

// 3. Importar handler DESPUÉS del mock (aunque jest.mock se eleva, esto es bueno por claridad)
import { handler } from '../../src/handlers/getPeople';

describe('getPeople Handler', () => {
    beforeEach(() => {
        // Limpiar mocks antes de cada test
        mockGetCharacters.mockReset();
    });

    it('should return 200 and transformed characters on success', async () => {
        // Arrange
        const mockSwapiResponse = {
            count: 1,
            next: null,
            previous: null,
            results: [
                {
                    name: "Luke Skywalker",
                    height: "172",
                    mass: "77",
                    hair_color: "blond",
                    skin_color: "fair",
                    eye_color: "blue",
                    birth_year: "19BBY",
                    gender: "male",
                    url: "https://swapi.dev/api/people/1/"
                }
            ]
        };

        mockGetCharacters.mockResolvedValue(mockSwapiResponse);

        const event = { queryStringParameters: { page: '1' } } as unknown as APIGatewayProxyEvent;
        const context = {} as Context;

        // Act
        const result: any = await handler(event, context, () => { });

        // Assert
        expect(result.statusCode).toBe(200);
        const body = JSON.parse(result.body);
        expect(body.characters).toHaveLength(1);
        expect(body.characters[0].name).toBe('Luke Skywalker');
        expect(body.characters[0].id).toBe('1');
    });

    it('should return 500 if SwapiService throws error', async () => {
        // Arrange
        mockGetCharacters.mockRejectedValue(new Error('SWAPI Error'));

        const event = { queryStringParameters: {} } as unknown as APIGatewayProxyEvent;
        const context = {} as Context;

        // Act
        const result: any = await handler(event, context, () => { });

        // Assert
        expect(result.statusCode).toBe(500);
        const body = JSON.parse(result.body);
        expect(body.message).toBe('Error al conectar con SWAPI');
    });
});
