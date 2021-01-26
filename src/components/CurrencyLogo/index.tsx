import { Currency, ETHER } from '@src/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import EthereumLogo from '../../assets/images/HT.svg'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import { useTokenBySymbol } from '../../hooks/Tokens'
import Logo from '../Logo'

const getTokenLogoURL = (address: string | undefined) =>
  `https://raw.githubusercontent.com/hswapprotocol/token-icons/master/heco/${address?.toLowerCase()}.png`

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const tokenInfo = useTokenBySymbol(currency?.symbol)
  if (currency?.symbol === 'USDT') console.log(tokenInfo?.address, currency?.symbol)
  const uriLocations = useHttpLocations(
    currency instanceof WrappedTokenInfo ? currency.logoURI : getTokenLogoURL(tokenInfo?.address)
  )

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []
    // @ts-ignore
    return [...uriLocations, getTokenLogoURL(currency?.address)]
  }, [currency, uriLocations])

  if (currency === ETHER) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} />
  }
  // console.log(currency, { srcs })
  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
