import * as React from "react"
import Svg, { SvgProps, Mask, Path, G } from "react-native-svg"
const SvgComponent = ({color = "#1C1B1F", ...props}: SvgProps & { color?: string }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Mask
      id="a"
      width={24}
      height={24}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha",
      }}
    >
      <Path fill="#D9D9D9" d="M0 0h24v24H0z" />
    </Mask>
    <G mask="url(#a)">
      <Path
        fill={color}
        fillOpacity={0.5}
        d="M6.857 19.2h9.286v-1.8h-1.857v-6.3h-1.857V9.3h3.714V7.5H6.857v1.8h1.857v6.3h1.857v1.8H6.857v1.8Zm0 1.8c-.51 0-.948-.176-1.311-.529A1.707 1.707 0 0 1 5 19.2v-1.8c0-.495.182-.919.546-1.271.363-.353.8-.529 1.311-.529v-4.5c-.51 0-.948-.176-1.311-.529A1.707 1.707 0 0 1 5 9.3V7.5c0-.495.182-.919.546-1.271.363-.353.8-.529 1.311-.529h2.786v-.9h-.929V3h5.572v1.8h-.929v.9h2.786c.51 0 .948.176 1.311.529.364.352.546.776.546 1.271v1.8c0 .495-.182.919-.546 1.271-.363.353-.8.529-1.311.529v4.5c.51 0 .948.176 1.311.529.364.352.546.776.546 1.271v1.8c0 .495-.182.919-.546 1.271-.363.353-.8.529-1.311.529H6.857Z"
      />
    </G>
  </Svg>
)
export default SvgComponent
