import AbiDecoderContext from '@/context/AbiDecoderContext';
import { useContext } from 'react';

export default function useAbiDecoder() {
  return useContext(AbiDecoderContext);
}
