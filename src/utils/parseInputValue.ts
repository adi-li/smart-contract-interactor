import { toBN } from 'web3-utils';

export default function parseInputValue(input: HTMLInputElement) {
  const { dataType } = input.dataset as { dataType: string };
  if (dataType.startsWith('uint') || dataType.startsWith('int')) {
    const length = parseInt(dataType.replace(/^u?int/, ''), 10);
    if (dataType.endsWith('[]')) {
      return input.value
        .split(',')
        .map((value) => (length <= 32 ? parseInt(value, 10) : toBN(value)));
    }
    return length <= 32 ? parseInt(input.value, 10) : toBN(input.value);
  }
  switch (dataType) {
    default:
      return input.value;
  }
}
