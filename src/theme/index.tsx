// import { transparentize } from 'polished'
import React, { useMemo } from 'react'
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme
} from 'styled-components'
import { useIsDarkMode } from '../state/user/hooks'
import { Text, TextProps } from 'rebass'
import { Colors } from './styled'

export * from './components'

const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'
const black = '#000000'

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white,
    black,

    // text，1-5dark下颜色越来越深
    text1: darkMode ? '#FFFFFF' : '#000000',
    // 一级色 大标题、正文
    text2: darkMode ? '#E6E2F1' : '#191D2B',
    // 二级 小标题、正文
    text3: darkMode ? '#B0A9C2' : '#4E4E67',
    // 三级色 辅助类提示信息
    text4: darkMode ? '#6B6C84' : '#8E8FAB',
    // 四级色 输入框内弱提示
    text5: darkMode ? '#4C5466' : '#AAB3C7',

    // 标准品牌色
    text6: darkMode ? '#6840DD' : '#6840DD',

    // 强调文字色
    text7: darkMode ? '#9977FD' : '#9977FD',

    // 涨色
    text8: darkMode ? '#13C08C' : '#13C08C',

    // 跌色
    text9: darkMode ? '#FF3E3E' : '#FF3E3E',

    // 持平色
    text10: darkMode ? '#909B9C' : '#909B9C',

    // 链接色
    text11: darkMode ? '#3C67FF' : '#3C67FF',

    // 提示文字
    text12: darkMode ? '#FE8100' : '#FE8100',

    // backgrounds / greys
    // 前景色
    bg1: darkMode ? '#1E1E30' : '#FFFFFF',
    // 背景色
    bg2: darkMode ? '#131522' : '#F1F3F6',
    // 辅助bg色
    bg3: darkMode ? '#242438' : '#F6F6FB',
    // 小标签bg
    bg4: darkMode ? '#222C51' : '#ECEFFD',
    // 小标签bg
    bgTagS: darkMode ? '#2B2251' : '#F0ECFD',
    // Hover色
    bg5: darkMode ? '#37304B' : '#EAE7F5',
    // 分割线 & 边框色
    bg6: darkMode ? '#2C2B50' : '#D9D7F1',

    //specialty colors
    modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
    advancedBG: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',

    //primary colors
    primary1: darkMode ? '#6840DD' : '#6840DD',
    primary2: darkMode ? '#3680E7' : '#FF8CC3',
    primary3: darkMode ? '#4D8FEA' : '#FF99C9',
    primary4: darkMode ? '#376bad70' : '#F6DDE8',
    primary5: darkMode ? '#9977FD' : '#9977FD',
    // 兑换按钮不可用
    disable1: darkMode ? '#37354C' : '#DFDEED',
    // 兑换按钮按下
    pressed1: darkMode ? '#5431B9' : '#5431B9',

    // color text
    primaryText1: darkMode ? '#6840DD' : '#6840DD',

    // secondary colors
    secondary1: darkMode ? '#6840DD' : '#6840DD',
    secondary2: darkMode ? '#17000b26' : '#F6DDE8',
    secondary3: darkMode ? '#9977FD' : '#9977FD',

    // other
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E',
    blue1: '#2172E5',
    shadow: darkMode ? '0px 4px 16px 4px rgba(0, 0, 0, 0.2)' : '0px 4px 16px rgba(131, 142, 163, 0.1)',

    // dont wanna forget these blue yet
    // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',
  }
}

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    grids: {
      sm: 8,
      md: 12,
      lg: 24
    },

    //shadows
    shadow1: darkMode ? '#000' : '#2F80ED',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
    darkMode
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useIsDarkMode()

  const themeObject = useMemo(() => theme(darkMode), [darkMode])

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  white(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow1'} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  }
}

export const FixedGlobalStyle = createGlobalStyle`
html, input, textarea, button {
  font-family: 'Inter', sans-serif;
  font-display: fallback;
}
@supports (font-variation-settings: normal) {
  html, input, textarea, button {
    font-family: 'Inter var', sans-serif;
  }
}

html,
body {
  margin: 0;
  padding: 0;
}

 a {
   color: ${colors(false).blue1}; 
 }

* {
  box-sizing: border-box;
}

button {
  user-select: none;
}

html {
  font-size: 16px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;
  
}
`

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg2};
}

body {
  min-height: 100vh;
  background: ${({ theme }) =>
    theme.darkMode
      ? `rgba(0, 0, 0, 0.6);`
      : `radial-gradient(49.1% 87.28% at 50.9% 50%, rgba(223, 220, 254, 0.6) 0%, rgba(255, 255, 255, 0) 100%);`}
  
}
`
