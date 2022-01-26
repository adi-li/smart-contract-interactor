import { createContext } from 'react';

export interface Chain {
  network: string;
  chainId: number;
}

const ChainContext = createContext<Chain[]>([]);

export default ChainContext;
