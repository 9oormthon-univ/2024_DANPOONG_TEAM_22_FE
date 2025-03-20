import React from 'react';
import {ImageBackground, View} from 'react-native';

export const ShadowView = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <View
      className={`w-full h-full rounded-card overflow-hidden ${className} `}
     >
      <ImageBackground
        source={require('@assets/webps/ShadowBox.webp')}
        className="w-full h-full"
        resizeMode="stretch">
        {children}
      </ImageBackground>
    </View>
  );
};