import { ethers } from 'ethers';

export default function toChecksumAddress(address: string) {
  try {
    return ethers.utils.getAddress(address);
  } catch {
    return '';
  }
}
