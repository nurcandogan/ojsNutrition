import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={16}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      d="M.892 1.353A.84.84 0 0 1 1.14.755l.507-.508a.84.84 0 0 1 .921-.183.84.84 0 0 1 .275.183l6.895 6.895a.84.84 0 0 1 .247.6.84.84 0 0 1-.247.602L2.85 15.232a.84.84 0 0 1-.6.247.84.84 0 0 1-.598-.247l-.607-.508L.89 1.354v-.001Z"
    />
  </Svg>
)
export default SvgComponent
