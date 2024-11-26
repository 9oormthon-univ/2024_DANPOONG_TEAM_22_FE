import { SizedTextProps } from '@components/atom/LeeSeoyunText'
import { Text } from 'react-native'

const VoltaireText = ({
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
          fontFamily: 'Voltaire-Regular',
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

export default VoltaireText
