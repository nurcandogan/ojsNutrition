import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      stroke="#292D32"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16.3 4.623c-2.827-.219-5.68-.328-8.519-.328-1.685 0-3.37.07-5.043.199L1 4.623M5.557 3.968l.189-1.154c.135-.833.243-1.464 1.742-1.464H9.81c1.499 0 1.607.658 1.742 1.464l.189 1.14M14.347 4.95l-.545 8.455c-.089 1.32-.165 2.345-2.484 2.345H5.982c-2.32 0-2.395-1.025-2.484-2.345L2.953 4.95"
    />
  </Svg>
)
export default SvgComponent
