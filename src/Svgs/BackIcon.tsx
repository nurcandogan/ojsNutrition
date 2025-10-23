import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={7}
    height={11}
    fill="none"
    {...props}
  >
    <Path
      fill="#1C1B1F"
      d="M2.063 5.516 6.459.958 5.475 0 0 5.525 5.525 11l.976-.967-4.438-4.517Z"
    />
  </Svg>
)
export default SvgComponent
