import { createContext } from 'react';

export interface Chain {
  name: string;
  chainId: number;
}

const ChainContext = createContext<Chain[]>([]);

export default ChainContext;
