export default {
  fonts: {
    body: "Montserrat, sans-serif",
    heading: "Poppins, serif",
    mono: "Menlo, monospace",
  },
  colors: {
    // https://coolors.co/00283d-d62828-f77f00-fcbf49-eae2b7
    primary: {
      50: '#FFFAE4',
      100: '#FFF4C9',
      200: '#FFEFAE',
      300: '#FFE993',
      400: '#FFE478',
      500: '#FFDF5D',
      600: '#FCCA00',
      700: '#FFD014',
      800: '#E6B800',
      900: '#B89300',
    },
    secondary: {
      50: '#e2ebff',
      100: '#b1c2ff',
      200: '#7f99ff',
      300: '#4d70ff',
      400: '#1d48fe',
      500: '#062ee5',
      600: '#0024b3',
      700: '#001a81',
      800: '#000f50',
      900: '#000520',
    },
    yellow: {
      50: '#fff6dc',
      100: '#ffe5b0',
      200: '#fdd381',
      300: '#fcc14f', //
      400: '#fbb020',
      500: '#e29609',
      600: '#b07503',
      700: '#7d5300',
      800: '#4c3200',
      900: '#1c1000',
    },
    red: {
      50: '#ffe6e6',
      100: '#f8bdbd',
      200: '#ed9393',
      300: '#e46868',
      400: '#db3e3e',
      500: '#c12424', //
      600: '#971b1b',
      700: '#6c1213',
      800: '#430809',
      900: '#1d0000',
    },
    orange: {
      50: '#fff2da',
      100: '#ffd9ae',
      200: '#ffc17d',
      300: '#ffa84c',
      400: '#ff901a',
      500: '#e67600', //
      600: '#b35c00',
      700: '#814100',
      800: '#4f2600',
      900: '#200b00',
    }
  },
  // styles: {
  //   global: {
  //     body: {
  //       color: "gray.900"
  //     }
  //   }
  // },
  components: {
    // https://chakra-ui.com/docs/theming/customize-theme#customizing-single-components
    Badge: {
      // 1. We can update the base styles
      baseStyle: {
        fontSize: "0.7rem"
      },
      // 2. We can add a new button size or extend existing
      // sizes: {
      //   xs: {
      //     // h: "56px",
      //     fontSize: "xs",
      //     // px: "32px",
      //   },
      // },
      // 3. We can add a new visual variant
      // variants: {
      //   "with-shadow": {
      //     bg: "red.400",
      //     boxShadow: "0 0 2px 2px #efdfde",
      //   },
      //   // 4. We can override existing variants
      //   solid: (props) => ({
      //     bg: props.colorMode === "dark" ? "red.300" : "red.500",
      //   }),
      // },
    },
  },
}