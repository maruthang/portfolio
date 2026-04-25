export const colors = {
  brand: {
    50: '#e6f1ff',
    100: '#cce3ff',
    200: '#99c7ff',
    300: '#66abff',
    400: '#338fff',
    500: '#58a6ff',
    600: '#1f7ae0',
    700: '#155bb0',
    800: '#0c3d80',
    900: '#061f50',
    950: '#031028',
  },
  neutral: {
    50: '#f7f8f9',
    100: '#eff1f3',
    200: '#dde1e6',
    300: '#c1c8d0',
    400: '#8b949e',
    500: '#6e7681',
    600: '#484f58',
    700: '#30363d',
    800: '#21262d',
    900: '#161b22',
    950: '#0d1117',
  },
  semantic: {
    success: '#3fb950',
    warning: '#d29922',
    error: '#f85149',
    info: '#58a6ff',
  },
} as const;

export type ColorTokens = typeof colors;
