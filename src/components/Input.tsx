import BaseInput, { BaseInputProps, getInputClass } from './BaseInput';

export type InputProps = BaseInputProps & JSX.IntrinsicElements['input'];

export default function Input({
  title,
  helpText,
  wrapperClassName,
  ...props
}: InputProps) {
  const { className, ...inputProps } = props;
  return (
    <BaseInput
      title={title}
      helpText={helpText}
      wrapperClassName={wrapperClassName}
    >
      <input className={getInputClass(className)} {...inputProps} />
    </BaseInput>
  );
}
