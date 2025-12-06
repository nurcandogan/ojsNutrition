/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        bordergray:'#E5E5E5',
        inputgray:'#E7E7E7',
        logintext:'#2126AB',
        ticaritext:'#777777',
        errortext:'#ff7300',
        discountText:'#ED2727',
        shortExplanationText  :'#636363',
        tagBg:'#F1F1F1',
        bisküvi:'#E6BC79',
        çikolata:'#56321D',
        muz:'#F1D018',
        caramel:'#B64300',
        chocoNut:'#7B3F00',
        hindistanCevizi:'#BA9051',
        cheesecake:'#CC1E5F',
        çilek:'#D61F33',
        commentBg:'#F7F7F7',
        comment:'#333333',
        ratingBg:'#EDEDED',
        lineColor:'#C0C0C0',
        answerBorder:'#F5F5F5',
        placeHolderText:'#A1A1AA',
        basketText:'#919191',
        searchBg:'#F3F3F3',
        orderText:'#52C41A',
        
      }
    },
  },
   safelist: [
    'bg-bisküvi',
    'bg-çikolata',
    'bg-muz',
    'bg-caramel',
    'bg-chocoNut',
    'bg-hindistanCevizi',
    'bg-cheesecake',
    'bg-çilek',
  ],
  plugins: [],
}