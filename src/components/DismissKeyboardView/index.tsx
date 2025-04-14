import {
  Keyboard,
  type StyleProp,
  TouchableWithoutFeedback,
  View,
  type ViewStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Component = {
  children: JSX.Element[] | JSX.Element;
  footer?: JSX.Element;
  style?: StyleProp<ViewStyle>;
};

export const DismissKeyboardView = ({
  children,
  footer,
  ...props
}: Readonly<Component>) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        {...props}
        style={props.style}
        // 사용자가 키보드가 열린 상태에서 아무 뷰나 터치하면, 그 터치 이벤트가 keyboard dismiss도 하고, 터치도 정상 처리
        keyboardShouldPersistTaps="handled">
        {children}
      </KeyboardAwareScrollView>

      {/* 키보드와 관계없이 항상 고정 */}
      {footer}
    </View>
  </TouchableWithoutFeedback>
);
