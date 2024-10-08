import BaseInputText from '../BaseInputText';
import { BaseInputProps } from '../BaseInputText/BaseInputText';
function BaseInputNumber(props: BaseInputProps) {
  return <BaseInputText {...props} keyboardType='number-pad' multiline={false} />;
}

export default BaseInputNumber;
