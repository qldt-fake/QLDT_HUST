import BaseInputText from '../BaseInputText';
import { BaseInputProps } from '../BaseInputText/BaseInputText';
function BaseInputPhone(props: BaseInputProps) {
  return <BaseInputText {...props} keyboardType='phone-pad' multiline={false} />;
}

export default BaseInputPhone;
