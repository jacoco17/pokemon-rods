import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'whiteAlpha.900',
      },
    },
  },
  components: {
    Card: {
      baseStyle: {
        container: {
          background: 'rgba(18, 18, 18, 0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: '0 6px 40px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    Button: {
      baseStyle: {
        fontWeight: '500',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
      },
      variants: {
        solid: {
          bg: 'whiteAlpha.100',
          _hover: {
            bg: 'whiteAlpha.200',
          },
          _active: {
            bg: 'whiteAlpha.300',
          },
        },
        ghost: {
          _hover: {
            bg: 'whiteAlpha.100',
          },
        },
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: 'whiteAlpha.50',
            border: '2px solid',
            borderColor: 'whiteAlpha.100',
            _hover: {
              bg: 'whiteAlpha.100',
            },
            _focus: {
              borderColor: 'whiteAlpha.200',
              bg: 'whiteAlpha.100',
            },
          },
        },
      },
      defaultProps: {
        variant: 'filled',
      },
    },
  },
  config,
});

export default theme; 