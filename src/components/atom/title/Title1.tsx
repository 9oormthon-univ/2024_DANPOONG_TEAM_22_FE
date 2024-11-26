import { Text, TextStyle } from 'react-native'

export type TextProps = {
  text: string
  className?: string
  style?: TextStyle | TextStyle[]
}

const Title1 = ({ text, ...props }: Readonly<TextProps>) => {
  const size = 30

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

export default Title1
