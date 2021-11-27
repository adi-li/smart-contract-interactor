import BaseInput, { BaseInputProps, getInputClass } from './BaseInput';

export type InputProps = BaseInputProps & JSX.IntrinsicElements['textarea'];

export default function Textarea({
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
      <textarea className={getInputClass(className)} {...inputProps} />
    </BaseInput>
  );
}
