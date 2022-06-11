import { ethers } from 'ethers';

export default function toWei(
  value: string | null | undefined,
  unit: ethers.BigNumberish = 'wei',
) {
  if (value == null) return '';
  try {
    return ethers.utils.parseUnits(value, unit).toString();
  } catch (error) {
    return '';
  }
}
