import 'reflect-metadata';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

import { GamesController } from './games/games.controller';
import { UsersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { GamesService } from './games/games.service';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { AuthUserPayload } from './auth/types/auth-user.payload';
import { SubmitPriceDto } from './prices/dto/submit-price.dto';
import { AuthenticatedRequest } from './auth/types/authenticated-request.type';

describe('API controllers', () => {
  let app: INestApplication;
  let gamesController: GamesController;
  let usersController: UsersController;
  let authController: AuthController;

  const authenticatedUser: AuthUserPayload = {
    id: 99,
    steamId: 'steam-99',
    username: 'test-user',
    avatarUrl: 'http://avatar/url.png',
  };

  const games = [
    {
      id: 1,
      steamAppId: 10,
      name: 'Alpha',
      price: 1999,
      currency: 'USD',
      metadata: { genre: 'Action' },
      playerPeak: 5000,
    },
    {
      id: 2,
      steamAppId: 20,
      name: 'Beta',
      price: 999,
      currency: 'USD',
      metadata: null,
      playerPeak: 2500,
    },
  ];

  const gameMetricsById: Record<number, { median: number; average: number; count: number }> = {
    1: { median: 1800, average: 1850, count: 4 },
    2: { median: 900, average: 950, count: 2 },
  };

  const gamesService: jest.Mocked<GamesService> = {
    findAll: jest.fn(),
    findOneById: jest.fn(),
    getMetrics: jest.fn(),
    submitPrice: jest.fn(),
    refreshGamesFromSteam: jest.fn(),
    executeDailySync: jest.fn(),
  } as unknown as jest.Mocked<GamesService>;

  const usersService: jest.Mocked<UsersService> = {
    upsertSteamUser: jest.fn(),
    findProfileWithPrices: jest.fn(),
  } as unknown as jest.Mocked<UsersService>;

  const authService: jest.Mocked<AuthService> = {
    validateSteamProfile: jest.fn(),
    createSessionToken: jest.fn(),
  } as unknown as jest.Mocked<AuthService>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [GamesController, UsersController, AuthController],
      providers: [
        { provide: GamesService, useValue: gamesService },
        { provide: UsersService, useValue: usersService },
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    gamesController = app.get(GamesController);
    usersController = app.get(UsersController);
    authController = app.get(AuthController);
  });

  beforeEach(() => {
    jest.clearAllMocks();

    gamesService.findAll.mockResolvedValue(games as never);
    gamesService.findOneById.mockResolvedValue(games[0] as never);
    gamesService.getMetrics.mockImplementation(async (id: number) => gameMetricsById[id] as never);
    gamesService.submitPrice.mockResolvedValue(undefined);

    usersService.findProfileWithPrices.mockResolvedValue({
      id: authenticatedUser.id,
      username: authenticatedUser.username,
      prices: [{ gameId: 1, povPrice: 1500 }],
    } as never);

    authService.createSessionToken.mockReturnValue('signed-token');
    authService.validateSteamProfile.mockResolvedValue(authenticatedUser);
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/games should list games with community metrics', async () => {
    const result = await gamesController.listGames();

    expect(result).toEqual([
      {
        id: 1,
        steamAppId: 10,
        name: 'Alpha',
        price: 1999,
        currency: 'USD',
        metadata: { genre: 'Action' },
        playerPeak: 5000,
        community: { median: 1800, average: 1850, count: 4 },
      },
      {
        id: 2,
        steamAppId: 20,
        name: 'Beta',
        price: 999,
        currency: 'USD',
        metadata: undefined,
        playerPeak: 2500,
        community: { median: 900, average: 950, count: 2 },
      },
    ]);
    expect(gamesService.findAll).toHaveBeenCalledTimes(1);
    expect(gamesService.getMetrics).toHaveBeenCalledTimes(2);
  });

  it('GET /api/games/:id should return a single game with metrics', async () => {
    const result = await gamesController.getGame(1);

    expect(result).toEqual({
      id: 1,
      steamAppId: 10,
      name: 'Alpha',
      price: 1999,
      currency: 'USD',
      metadata: { genre: 'Action' },
      playerPeak: 5000,
      community: { median: 1800, average: 1850, count: 4 },
    });
    expect(gamesService.findOneById).toHaveBeenCalledWith(1);
    expect(gamesService.getMetrics).toHaveBeenCalledWith(1);
  });

  it('POST /api/games/:id/submit should accept authenticated price submission', async () => {
    const validatedBody = { price: 2100 } as SubmitPriceDto;
    const request = { user: authenticatedUser } as unknown as AuthenticatedRequest;

    const result = await gamesController.submitPrice(1, validatedBody, request);

    expect(result).toEqual({ ok: true });
    expect(gamesService.submitPrice).toHaveBeenCalledWith(authenticatedUser.id, 1, 2100);
  });

  it('GET /api/profile/me should return current user profile and prices', async () => {
    const request = { user: authenticatedUser } as unknown as AuthenticatedRequest;

    const result = await usersController.getProfile(request);

    expect(result).toEqual({
      id: authenticatedUser.id,
      username: authenticatedUser.username,
      prices: [{ gameId: 1, povPrice: 1500 }],
    });
    expect(usersService.findProfileWithPrices).toHaveBeenCalledWith(authenticatedUser.id);
  });

  it('GET /api/auth/steam/callback should create session token and return payload', async () => {
    const session: Record<string, unknown> = {};
    const request = { user: authenticatedUser, session } as unknown as AuthenticatedRequest;
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const response = { json, status } as unknown as Response;

    await authController.handleSteamCallback(request, response);

    expect(authService.createSessionToken).toHaveBeenCalledWith(authenticatedUser);
    expect(json).toHaveBeenCalledWith({ ok: true, token: 'signed-token' });
    expect(session.jwt).toBe('signed-token');
    expect(session.user).toEqual(authenticatedUser);
    expect(status).not.toHaveBeenCalled();
  });
});
