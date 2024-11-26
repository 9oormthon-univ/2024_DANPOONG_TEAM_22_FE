import { TextProps } from '@components/atom/title/Title1'
import { Text } from 'react-native'

const Title4 = ({ text, ...props }: Readonly<TextProps>) => {
  const size = 20

  return (
    <Text
      {...props}
      className={props.className}
      style={[
        {
          fontFamily: 'WantedSans-SemiBold',
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

export default Title4
