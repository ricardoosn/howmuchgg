import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';

type MostPlayedResponse = {
  response?: {
    ranks?: Array<{
      appid: number;
      rank: number;
      last_week_rank?: number;
      peak_in_game: number;
    }>;
  };
};

type AppDetailsResponse = Record<
  string,
  {
    success: boolean;
    data?: {
      name?: string;
      price_overview?: { final?: number; currency?: string };
      detailed_description?: string;
      header_image?: string;
      genres?: Array<{ id: string; description: string }>;
    };
  }
>;

@Injectable()
export class SteamApiService {
  private readonly logger = new Logger(SteamApiService.name);

  constructor(private readonly httpService: HttpService) {}

  public async fetchMostPlayed(): Promise<Array<{ appId: number; peakPlayers: number }>> {
    const url = 'https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/';
    const response: AxiosResponse<MostPlayedResponse> = await this.httpService.axiosRef.get(url, {
      timeout: 10000,
    });
    const ranks = response.data.response?.ranks ?? [];
    return ranks.map((rank) => ({
      appId: rank.appid,
      peakPlayers: rank.peak_in_game,
    }));
  }

  public async fetchAppDetails(appId: number): Promise<{
    name: string;
    price: number;
    currency: string;
    metadata: Record<string, unknown>;
  }> {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;
    const response: AxiosResponse<AppDetailsResponse> = await this.httpService.axiosRef.get(url, {
      timeout: 10000,
    });
    const details = response.data[String(appId)];
    if (!details || !details.success || !details.data) {
      this.logger.warn(`App details missing for ${appId}`);
      return { name: `app-${appId}`, price: 0, currency: 'USD', metadata: {} };
    }
    const price = details.data.price_overview?.final ?? 0;
    const currency = details.data.price_overview?.currency ?? 'USD';
    const metadata = {
      description: details.data.detailed_description,
      headerImage: details.data.header_image,
      genres: details.data.genres,
    };
    return {
      name: details.data.name ?? `app-${appId}`,
      price,
      currency,
      metadata,
    };
  }
}
