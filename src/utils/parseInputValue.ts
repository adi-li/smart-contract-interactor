import { toBN } from 'web3-utils';

const convertBoolean = (value: string) => {
  if (value === 'true') return true;
  return Boolean(parseInt(value, 10));
};

const convertTuple = (value: string) => JSON.parse(value);

const convert = (dataType: string, value: string) => {
  switch (dataType) {
    case 'bool':
      return convertBoolean(value);
    case 'tuple':
      return convertTuple(value);
    default:
      return value;
  }
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
  if (dataType.endsWith('[]')) {
    const itemDataType = dataType.slice(0, -2);
    if (itemDataType === 'tuple') {
      return convertTuple(input.value);
    }
    return input.value.split(',').map((val) => convert(itemDataType, val));
  }
  return convert(dataType, input.value);
}
