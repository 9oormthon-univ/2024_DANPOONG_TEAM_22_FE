import { TextProps } from '@components/atom/title/Title1'
import { Text } from 'react-native'

const Title3 = ({ text, ...props }: Readonly<TextProps>) => {
  const size = 22

  return (
    <Text
      {...props}
      className={props.className}
      style={[
        {
          fontFamily: 'WantedSans-Medium',
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

export default Title3
