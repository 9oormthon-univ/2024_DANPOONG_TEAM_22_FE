import { TextProps } from '@components/atom/title/Title1'
import { Text } from 'react-native'

const Body3 = ({ text, ...props }: Readonly<TextProps>) => {
  const size = 18

  return (
    <Text
      {...props}
      className={props.className}
      style={[
        {
          fontFamily: 'WantedSans-Regular',
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

export default Body3
