// import { Inject, Injectable, Logger } from '@nestjs/common';
// import { UseCase } from '@src/domain/use-case';
// import { ICryptoRepository, CryptoPrice, ICryptoAPI } from '@src/crypto/domain';

// @Injectable()
// export class UpdatePriceUseCase implements UseCase<void, CryptoPrice[]> {
//   private readonly logger = new Logger(UpdatePriceUseCase.name);

//   constructor(
//     @Inject(ICryptoRepository) private repository: ICryptoRepository,
//     @Inject(ICryptoAPI) private api: ICryptoAPI,
//   ) {}

//   async execute(): Promise<CryptoPrice[]> {
//     const symbols = await this.repository.listSymbols();

//     const prices = await this.api.getPrices({
//       symbols,
//       tokenPair: 'USDC',
//     });

//     await this.repository.savePrices(prices);

//     return prices;
//   }
// }
