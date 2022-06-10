import { toWei as baseToWei, Unit } from 'web3-utils';

export default function toWei(
  value: string | null | undefined,
  unit: Unit = 'wei',
) {
  if (value == null) return '';
  try {
    return baseToWei(value, unit);
  } catch (error) {
    return '';
  }
}
