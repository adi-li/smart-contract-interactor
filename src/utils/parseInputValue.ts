export default function parseInputValue(input: HTMLInputElement) {
  const { dataType } = input.dataset as { dataType: string };
  switch (dataType) {
    case 'uint256':
      return parseInt(input.value, 10);
    case 'uint256[]':
      return input.value.split(',').map((value) => parseInt(value, 10));
    default:
      return input.value;
  }
}
