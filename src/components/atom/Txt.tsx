import React from "react";
import { Text, TextStyle } from "react-native";
import { TxtProps } from "../../types/TxtType";

const getStyle = (type: string, color?: string, align?: string): TextStyle => {
    const colors = {
        'primary': '#F9F96C',
        'backgroundG': '#252738',
        'backgroundS': '#393C52',
        'gray_100': '#EFEFEF',
        'gray_200': '#D0D0D0',
        'gray_300': '#A0A0A0',
        'gray_400': '#717171',
        'gray_500': '#414141',
        'gray_600': '#333333',
        'white': '#FAFafa',
        'black': '#121212',
        'recording': '#f13a1e',
    };

    // 폰트별 공통 스타일
    const baseStyle = {
        color: color ? colors[color as keyof typeof colors] : undefined,
        textAlign: align as TextStyle['textAlign'],
    };

    // 달라지는 스타일
    const fontStyles = {
        "title1": { fontFamily: "WantedSans-SemiBold", fontSize: 30, lineHeight: 30*1.5, letterSpacing: 30 * -0.025 },
        "title2": { fontFamily: "WantedSans-SemiBold", fontSize: 25, lineHeight: 25*1.5, letterSpacing: 25 * -0.025 },
        "title3": { fontFamily: "WantedSans-Medium", fontSize: 22, lineHeight: 22*1.5, letterSpacing: 22 * -0.025 },
        "title4": { fontFamily: "WantedSans-SemiBold", fontSize: 20, lineHeight: 20*1.5, letterSpacing: 20 * -0.025 },
        "body1": { fontFamily: "WantedSans-Regular", fontSize: 22, lineHeight: 22*1.5, letterSpacing: 22 * -0.025 },
        "body2": { fontFamily: "WantedSans-Regular", fontSize: 20, lineHeight: 20*1.5, letterSpacing: 20 * -0.025 },
        "body3": { fontFamily: "WantedSans-Regular", fontSize: 18, lineHeight: 18*1.5, letterSpacing: 18 * -0.025 },
        "body4": { fontFamily: "WantedSans-Regular", fontSize: 16, lineHeight: 16*1.5, letterSpacing: 16 * -0.025 },
        "recording": { fontFamily: "WantedSans-Regular", fontSize: 32, lineHeight: 32*1.5, letterSpacing: 32 * -0.025 },
        "button": { fontFamily: "WantedSans-Medium", fontSize: 20, lineHeight: 20*1.5, letterSpacing: 20 * -0.025 },
        "caption1": { fontFamily: "WantedSans-Medium", fontSize: 14, lineHeight: 14*1.5, letterSpacing: 14 * -0.025 },
        "caption2": { fontFamily: "WantedSans-Medium", fontSize: 12, lineHeight: 12*1.5, letterSpacing: 12 * -0.025 },
        "caption3": { fontFamily: "WantedSans-Regular", fontSize: 10, lineHeight: 10*1.5, letterSpacing: 10 * -0.025 },
    };

    return { ...baseStyle, ...(fontStyles[type as keyof typeof fontStyles] || fontStyles["default"]) };
};

const Txt = ({ type, content, color, align }: TxtProps) => {
    const style = getStyle(type, color, align);
    return <Text style={style}>{content}</Text>;
};

export default Txt;
