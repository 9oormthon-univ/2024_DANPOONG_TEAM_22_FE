import React, { useEffect } from "react";
import { View, Animated } from "react-native";
import { COLORS } from "@constants/Colors";
export const Spinner = () => {
    const smallBarHeight = 30;
    const mediumBarHeight = 38;
    const largeBarHeight = 48;
    const times = 1.4;
    const duration = 200 *1.3;
    const maxHeight = largeBarHeight * times;
    // 각 막대에 대한 애니메이션 값 생성 (기본 길이 설정)
    const bar1Height = React.useRef(new Animated.Value(smallBarHeight)).current;
    const bar2Height = React.useRef(new Animated.Value(mediumBarHeight)).current;
    const bar3Height = React.useRef(new Animated.Value(largeBarHeight)).current;
    const bar4Height = React.useRef(new Animated.Value(mediumBarHeight)).current;
    const bar5Height = React.useRef(new Animated.Value(smallBarHeight)).current;

    // 애니메이션 시퀀스 정의
    const animateBars = () => {
        // 모든 막대 초기화
        bar1Height.setValue(smallBarHeight);
        bar2Height.setValue(mediumBarHeight);
        bar3Height.setValue(largeBarHeight);
        bar4Height.setValue(mediumBarHeight);
        bar5Height.setValue(smallBarHeight);

        // 다섯 막대의 순차적 애니메이션
        Animated.sequence([
            // 첫 번째 막대 애니메이션
            Animated.sequence([
                Animated.timing(bar1Height, {
                    toValue: smallBarHeight * times,
                    duration: duration,
                    useNativeDriver: false,
                }),
                Animated.timing(bar1Height, {
                    toValue: smallBarHeight,
                    duration: duration,
                    useNativeDriver: false,
                }),
            ]),
            // 두 번째 막대 애니메이션
            Animated.sequence([
                Animated.timing(bar2Height, {
                    toValue: mediumBarHeight * times,
                    duration: duration,
                    useNativeDriver: false,
                }),
                Animated.timing(bar2Height, {
                    toValue: mediumBarHeight,
                    duration: duration,
                    useNativeDriver: false,
                }),
            ]),
            // 세 번째 막대 애니메이션
            Animated.sequence([
                Animated.timing(bar3Height, {
                    toValue: largeBarHeight * times,
                    duration: duration,
                    useNativeDriver: false,
                }),
                Animated.timing(bar3Height, {
                    toValue: largeBarHeight,
                    duration: duration,
                    useNativeDriver: false,
                }),
            ]),
            // 네 번째 막대 애니메이션
            Animated.sequence([
                Animated.timing(bar4Height, {
                    toValue: mediumBarHeight * times,
                    duration: duration,
                    useNativeDriver: false,
                }),
                Animated.timing(bar4Height, {
                    toValue: mediumBarHeight,
                    duration: duration,
                    useNativeDriver: false,
                }),
            ]),
            // 다섯 번째 막대 애니메이션
            Animated.sequence([
                Animated.timing(bar5Height, {
                    toValue: smallBarHeight * times,
                    duration: duration,
                    useNativeDriver: false,
                }),
                Animated.timing(bar5Height, {
                    toValue: smallBarHeight,
                    duration: duration,
                    useNativeDriver: false,
                }),
            ]),
        ]).start(() => {
            setTimeout(() => {
                animateBars();
            }, 800);
        });
    };

    // 컴포넌트 마운트 시 애니메이션 시작
    useEffect(() => {
        animateBars();
    }, []);

    return (
        <View className="justify-center items-center w-auto" style={{height: maxHeight}}>
            <View className="flex-row items-center justify-center space-x-2">
                <Animated.View 
                    className="w-3 rounded mx-1" 
                    style={{ height: bar1Height, backgroundColor: COLORS.yellowPrimary}} 
                />
                <Animated.View 
                    className="w-3 rounded mx-1" 
                    style={{ height: bar2Height, backgroundColor: COLORS.yellowPrimary}} 
                />
                <Animated.View 
                    className="w-3 rounded mx-1" 
                    style={{ height: bar3Height, backgroundColor: COLORS.yellowPrimary}} 
                />
                <Animated.View 
                    className="w-3 rounded mx-1" 
                    style={{ height: bar4Height, backgroundColor: COLORS.yellowPrimary}} 
                />
                <Animated.View 
                    className="w-3 rounded mx-1" 
                    style={{ height: bar5Height, backgroundColor: COLORS.yellowPrimary}} 
                />
            </View>
        </View>
    );
};