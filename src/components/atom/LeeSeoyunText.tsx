import { TextProps } from '@components/atom/title/Title1'
import { Text } from 'react-native'

export interface SizedTextProps extends TextProps {
  size?: number
}

const LeeSeoYunText = ({
  size = 16,
  text,
  ...props
}: Readonly<SizedTextProps>) => {
  return (
    <Text
      {...props}
      className={props.className}
      style={[
        {
          fontFamily: 'LeeSeoyun-Regular',
          fontSize: size,
          lineHeight: size * 1.5,
          letterSpacing: size * -0.025,
        },
        props.style,
      ]}
    >
      {text}
    </Text>
  )
}

export default LeeSeoYunText
