import { Children, isValidElement, type ReactNode } from 'react';
import {
  Keyboard,
  Platform,
  type StyleProp,
  TouchableWithoutFeedback,
  View,
  type ViewStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useKeyboardHeight } from '@hooks/useKeyboardHeight';

type FooterProps = { children: ReactNode };

type Props = {
  children: ReactNode;
  /** 고정시킬 푸터가 있고, 키보드가 올라오면서 키보드 위 간격을 띄우고 싶을 경우, 키보드 위 간격 (android-only) */
  extraHeight?: number;
  /** 키보드 위에 올릴 컴포넌트가 있을 경우, 컴포넌트를 띄울 키보드 위 간격 */
  extraScrollHeight?: number;
  style?: StyleProp<ViewStyle>;
};

/** default extra offset when focusing the TextInputs. */
const DEFAULT_EXTRA_HEIGHT = 75;

// TODO: 안드로이드에서는 footer 고정이 안 되는 문제
export const DismissKeyboardView = ({
  children,
  extraHeight = 0,
  extraScrollHeight = 0,
  ...props
}: Props) => {
  const { maxKeyboardHeight } = useKeyboardHeight();

  // 푸터로 렌더링될 React 노드를 저장할 변수
  let footer: ReactNode = null;

  /** 푸터를 제외한 나머지 children */
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
          enableOnAndroid
          extraHeight={extraHeight}
          // KeyboardAwareScrollView 안에 있는 컴포넌트 중 키보드에 가려지는 컴포넌트의 경우, 키보드 위로 올라오도록 함
          extraScrollHeight={
            extraScrollHeight &&
            (Platform.OS === 'ios'
              ? extraScrollHeight
              : maxKeyboardHeight - DEFAULT_EXTRA_HEIGHT + extraScrollHeight)
          }
          // 사용자가 키보드가 열린 상태에서 아무 뷰나 터치하면, 그 터치 이벤트가 keyboard dismiss도 하고, 터치도 정상 처리
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          {...props}
          style={props.style}>
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
