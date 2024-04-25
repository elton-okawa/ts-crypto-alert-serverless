// import { Inject, Injectable, Logger } from '@nestjs/common';
// import { UseCase } from '@src/domain/use-case';
// import { ICryptoRepository, CryptoPrice, ICryptoAPI } from '@src/crypto/domain';

// @Injectable()
// export class UpdateHistoricalPriceUseCase
//   implements UseCase<string, CryptoPrice[]>
// {
//   private readonly logger = new Logger(UpdateHistoricalPriceUseCase.name);

//   constructor(
//     @Inject(ICryptoRepository) private repository: ICryptoRepository,
//     @Inject(ICryptoAPI) private api: ICryptoAPI,
//   ) {}

//   async execute(symbol: string): Promise<CryptoPrice[]> {
//     const prices = await this.api.getHistoricalPrice({
//       symbol,
//       tokenPair: 'USDC',
//     });

//     await this.repository.savePrices(prices);

//     return prices;
//   }
// }
