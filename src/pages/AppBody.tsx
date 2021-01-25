import React from 'react'
import styled from 'styled-components'
// import { rgba } from 'polished'
import * as StyledComponents from 'styled-components'

export const BodyWrapper = styled.div`
  position: relative;
  max-width: 420px;
  width: 100%;
  background: ${({ theme }) => theme.bg7};
  filter: drop-shadow(0px 4px 16px rgba(0, 65, 51, 0.05));
  border-radius: 24px;
  padding: 20px 24px 32px 24px;
  // backdrop-filter: blur(12px);
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 20px 20px 32px 20px;
  `};
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({
  children,
  style
}: {
  children: React.ReactNode
  style?: StyledComponents.CSSObject
}) {
  return <BodyWrapper style={style}>{children}</BodyWrapper>
}
