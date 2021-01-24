import React from 'react'
import styled from 'styled-components'
import { rgba } from 'polished'

export const BodyWrapper = styled.div`
  position: relative;
  max-width: 420px;
  width: 100%;
  background: ${({ theme }) => rgba(theme.bg1, 0.7)};
  filter: drop-shadow(0px 4px 16px rgba(131, 142, 163, 0.1));
  border-radius: 24px;
  padding: 1.5rem;
  backdrop-filter: blur(12px);
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
