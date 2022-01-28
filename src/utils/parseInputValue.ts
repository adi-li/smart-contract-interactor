import { toBN } from 'web3-utils';

const convertBoolean = (value: string) => {
  if (value === 'true') return true;
  return Boolean(parseInt(value, 10));
};

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
    case 'bool':
      return convertBoolean(input.value);
    case 'bool[]':
      return input.value.split(',').map((val) => convertBoolean(val.trim()));
    default:
      return input.value;
  }
}
