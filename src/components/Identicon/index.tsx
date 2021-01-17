import React, { useRef } from 'react'
import styled from 'styled-components'

import { useActiveWeb3React } from '../../hooks'

import EC from '../../assets/svg/ec.svg'
// import Jazzicon from 'jazzicon'

const StyledIdenticonContainer = styled.div`
  height: 1.4rem;
  width: 1.4rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.bg4};
`

export default function Identicon() {
  const ref = useRef<HTMLDivElement>()

  const { account } = useActiveWeb3React()

  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
  return (
    <StyledIdenticonContainer ref={ref as any}>
      {account && (
        <img
          style={{
            verticalAlign: 'baseline',
            width: '100%',
            height: '100%'
          }}
          src={EC}
        />
      )}
    </StyledIdenticonContainer>
  )
}
