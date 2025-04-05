import InfoIcon from '@assets/svgs/modalInfo.svg';
import {Button} from '@components/Button';
import {COLORS} from '@constants/Colors';
import React, {useEffect, useRef} from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from 'react-native';

export const Modal = ({
  visible,
  type,
  cancelText = '취소',
  confirmText = '확인',
  onCancel,
  onConfirm,
  children,
  buttonRatio,
}: {
  visible: boolean;
  type?: 'info';
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm?: () => void;
  children: React.ReactNode;
  buttonRatio?: '1:1' | '1:2';
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 justify-center items-center"
      style={[{opacity: fadeAnim}]}>
      {/* 딤 처리된 배경 클릭 시 모달 닫힘 */}
      <Pressable
        className="absolute top-0 left-0 right-0 bottom-0"
        onPress={onCancel}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{width: '90%', maxWidth: 320}}>
        <View
          className="bg-blue500 px-[22] pb-[19] items-center"
          style={{
            borderRadius: 10,
          }}>
          {type === 'info' && (
            <View className="mt-[29]">
              <InfoIcon />
            </View>
          )}
          {children}
          <View className="flex-row w-full">
            {(buttonRatio === '1:1' || buttonRatio === '1:2') && onCancel && (
              <Button
                text={cancelText}
                onPress={onCancel}
                containerStyle={{
                  backgroundColor: COLORS.gray300,
                  flex: buttonRatio === '1:2' ? 1 : 1,
                }}
                textStyle={{color: COLORS.white}}
              />
            )}
            <View className="w-[15]" />
            {onConfirm && (
              <Button
                text={confirmText}
                onPress={onConfirm}
                containerStyle={{
                  flex: buttonRatio === '1:2' ? 2 : 1,
                }}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};
