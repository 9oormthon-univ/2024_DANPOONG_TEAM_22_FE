import { Children, isValidElement, type ReactNode } from 'react';
import {
  Keyboard,
  type StyleProp,
  TouchableWithoutFeedback,
  View,
  type ViewStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type FooterProps = { children: ReactNode };

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const DismissKeyboardView = ({ children, ...props }: Props) => {
  // 푸터로 렌더링될 React 노드를 저장할 변수
  let footer: ReactNode = null;

  // 자식 요소들을 순회하며 DismissKeyboardView.Footer 컴포넌트를 찾고,
  // 찾은 경우 해당 컴포넌트의 자식(푸터 내용)을 footer 변수에 저장하고,
  // 원래 자식 목록에서는 제거합니다.
  const filteredChildren = Children.map(children, child => {
    if (
      isValidElement(child) &&
      child.type === DismissKeyboardView.Footer // 자식 요소의 타입이 DismissKeyboardView.Footer인지 확인
    ) {
      // DismissKeyboardView.Footer 컴포넌트의 자식 요소를 footer 변수에 할당
      footer = (child as React.ReactElement<FooterProps>).props.children;

      // 해당 자식(DismissKeyboardView.Footer)은 메인 컨텐츠 영역에서 렌더링하지 않도록 null 반환
      return null;
    }

    // DismissKeyboardView.Footer가 아닌 다른 자식 요소는 그대로 반환
    return child;
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          {...props}
          style={props.style}
          // 사용자가 키보드가 열린 상태에서 아무 뷰나 터치하면, 그 터치 이벤트가 keyboard dismiss도 하고, 터치도 정상 처리
          keyboardShouldPersistTaps="handled">
          {filteredChildren}
        </KeyboardAwareScrollView>

        {/* 키보드와 관계없이 항상 고정 */}
        {footer}
      </View>
    </TouchableWithoutFeedback>
  );
};

const Footer = ({ children }: FooterProps) => <>{children}</>;

Footer.displayName = 'DismissKeyboardView.Footer';

DismissKeyboardView.Footer = Footer;
