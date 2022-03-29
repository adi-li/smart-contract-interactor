import AbiDecoder from '@/utils/abi-decoder';
import { createContext } from 'react';

const AbiDecoderContext = createContext<AbiDecoder | undefined>(undefined);

export default AbiDecoderContext;
