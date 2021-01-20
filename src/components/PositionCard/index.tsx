import { JSBI, Pair, Percent, TokenAmount } from '@src/sdk'
import { darken } from 'polished'
import React, { useState, useContext } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useTotalSupply } from '../../data/TotalSupply'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { ExternalLink, TYPE, HideExtraSmall, ExtraSmallOnly } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { ButtonPrimary, ButtonEmpty, ButtonUNIGradient } from '../Button'
// import { transparentize } from 'polished'
import { CardNoise } from '../earn/styled'

import { useColor } from '../../hooks/useColor'

import Card, { GreyCard, LightCard } from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween, RowFixed, AutoRow } from '../Row'
import { Dots } from '../swap/styleds'
import { BIG_INT_ZERO } from '../../constants'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const HoverCard = styled(Card)`
  border: 1px solid transparent;
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`

const StyledPositionCard = styled(LightCard)<{ bgColor: any }>`
  border: 1px solid ${({ theme }) => theme.bg6};
  margin-top: 20px;
  position: relative;
  overflow: hidden;
`
const ButtonEmptyWrap = styled(ButtonEmpty)`
  color: ${({ theme }) => theme.text2};
  &:hover,
  &:focus {
    text-decoration: none;
    color: ${({ theme }) => theme.text1};
  }
`

const Text3 = styled(Text)`
  color: ${({ theme }) => theme.text3};
`

const Link2 = styled(ExternalLink)`
  color: ${({ theme }) => theme.text11};
  padding-bottom: 0;
`
const AutoColumnWrap = styled(AutoColumn)`
  background: ${({ theme }) => theme.bg3};
  border-radius: 12px;
  padding: 20px;
`

interface PositionCardProps {
  pair: Pair
  showUnwrapped?: boolean
  border?: string
  stakedBalance?: TokenAmount // optional balance to indicate that liquidity is deposited in mining pool
}

export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const htmlTheme = useContext(ThemeContext)

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  // const poolTokenPercentage =
  //   !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
  //     ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
  //     : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
        <GreyCard border={'0'} padding="20px 16px">
          <AutoColumn gap="18px">
            <FixedHeightRow>
              <RowFixed>
                <Text fontWeight={500} fontSize={16}>
                  {t('myHold')}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                {/* <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} /> */}
                <Text fontWeight={500} fontSize={14} color={htmlTheme.text4}>
                  {currency0.symbol}-{currency1.symbol}
                </Text>
              </RowFixed>
              <RowFixed>
                <Text fontWeight={500} fontSize={14}>
                  {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <AutoColumn gap="12px">
              {/* <FixedHeightRow>
                <Text fontSize={14} fontWeight={500} color={htmlTheme.text4}>
                  Your pool share
                </Text>
                <Text fontSize={14} fontWeight={500} color={htmlTheme.text3}>
                  {poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}
                </Text>
              </FixedHeightRow> */}
              <FixedHeightRow>
                <Text fontSize={14} fontWeight={500} color={htmlTheme.text4}>
                  {currency0.symbol}
                </Text>
                {token0Deposited ? (
                  <RowFixed>
                    <Text fontSize={14} fontWeight={500} marginLeft={'6px'} color={htmlTheme.text3}>
                      {token0Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={14} fontWeight={500} color={htmlTheme.text4}>
                  {currency1.symbol}
                </Text>
                {token1Deposited ? (
                  <RowFixed>
                    <Text fontSize={14} fontWeight={500} marginLeft={'6px'} color={htmlTheme.text3}>
                      {token1Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
            </AutoColumn>
          </AutoColumn>
        </GreyCard>
      ) : (
        <LightCard>
          <TYPE.subHeader style={{ textAlign: 'center' }}>
            <span role="img" aria-label="wizard-icon">
              ⭐️
            </span>{' '}
            {t('hint6')}
          </TYPE.subHeader>
        </LightCard>
      )}
    </>
  )
}

export default function FullPositionCard({ pair, border, stakedBalance }: PositionCardProps) {
  const { account } = useActiveWeb3React()


  const { t } = useTranslation()
  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  // if staked balance balance provided, add to standard liquidity amount
  const userPoolBalance = stakedBalance ? userDefaultPoolBalance?.add(stakedBalance) : userDefaultPoolBalance

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  const backgroundColor = useColor(pair?.token0)

  return (
    <div>
      <StyledPositionCard border={border} bgColor={backgroundColor}>
        <CardNoise />
        <AutoColumn gap="12px">
          <FixedHeightRow>
            <AutoRow gap="8px">
              <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={26} />
              <Text fontWeight={500} fontSize={18}>
                {!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol}/${currency1.symbol}`}
              </Text>
              {!!stakedBalance && (
                <ButtonUNIGradient as={Link} to={`/uni/${currencyId(currency0)}/${currencyId(currency1)}`}>
                  <HideExtraSmall>Earning UNI</HideExtraSmall>
                  <ExtraSmallOnly>
                    <span role="img" aria-label="bolt">
                      ⚡
                    </span>
                  </ExtraSmallOnly>
                </ButtonUNIGradient>
              )}
            </AutoRow>

            <RowFixed gap="8px">
              <ButtonEmptyWrap
                padding="6px 8px"
                borderRadius="12px"
                width="fit-content"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? (
                  <>
                    {t('manage')}
                    <ChevronUp size="20" style={{ marginLeft: '10px' }} />
                  </>
                ) : (
                  <>
                    {t('manage')}
                    <ChevronDown size="20" style={{ marginLeft: '10px' }} />
                  </>
                )}
              </ButtonEmptyWrap>
            </RowFixed>
          </FixedHeightRow>
        </AutoColumn>
      </StyledPositionCard>
      {showMore && (
        <AutoColumnWrap gap="8px">
          <FixedHeightRow>
            <Text fontSize={16} fontWeight={600}>
                {t('yourLPToken')}
            </Text>
            <Text fontSize={16} fontWeight={600}>
              {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
            </Text>
          </FixedHeightRow>
          {stakedBalance && (
            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                {t('poolTokensRewards')}
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {stakedBalance.toSignificant(4)}
              </Text>
            </FixedHeightRow>
          )}
          <FixedHeightRow>
            <RowFixed>
              <Text3 fontSize={14} fontWeight={400}>
                {t('Invested')} {currency0.symbol}:
              </Text3>
            </RowFixed>
            {token0Deposited ? (
              <RowFixed>
                <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency0} />
                <Text fontSize={14} fontWeight={400} marginLeft={'6px'}>
                  {token0Deposited?.toSignificant(6)}
                </Text>
              </RowFixed>
            ) : (
              '-'
            )}
          </FixedHeightRow>

          <FixedHeightRow>
            <RowFixed>
              <Text3 fontSize={14} fontWeight={400}>
                {t('Invested')} {currency1.symbol}:
              </Text3>
            </RowFixed>
            {token1Deposited ? (
              <RowFixed>
                <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency1} />
                <Text fontSize={14} fontWeight={400} marginLeft={'6px'}>
                  {token1Deposited?.toSignificant(6)}
                </Text>
              </RowFixed>
            ) : (
              '-'
            )}
          </FixedHeightRow>

          <FixedHeightRow>
            <Text3 fontSize={14} fontWeight={400}>
                {t('LiquidityRatio')}
            </Text3>
            <Text fontSize={14} fontWeight={400}>
              {poolTokenPercentage
                ? (poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)) + '%'
                : '-'}
            </Text>
          </FixedHeightRow>

          {userDefaultPoolBalance && JSBI.greaterThan(userDefaultPoolBalance.raw, BIG_INT_ZERO) && (
            <RowBetween marginTop="10px">
              <ButtonPrimary
                padding="8px"
                borderRadius="8px"
                as={Link}
                to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                width="48%"
              >
                {t('add')}
              </ButtonPrimary>
              <ButtonPrimary
                padding="8px"
                borderRadius="8px"
                as={Link}
                width="48%"
                to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
              >
                {t('remove')}
              </ButtonPrimary>
            </RowBetween>
          )}
          <ButtonEmptyWrap>
            <Link2 style={{ width: '100%', textAlign: 'center' }} href={`https://info.hugswap.com/account/${account}`}>
              {t('viewData')}
            </Link2>
          </ButtonEmptyWrap>
          {stakedBalance && JSBI.greaterThan(stakedBalance.raw, BIG_INT_ZERO) && (
            <ButtonPrimary
              padding="8px"
              borderRadius="8px"
              as={Link}
              to={`/uni/${currencyId(currency0)}/${currencyId(currency1)}`}
              width="100%"
            >
                {t('manageLiquidity')}
            </ButtonPrimary>
          )}
        </AutoColumnWrap>
      )}
    </div>
  )
}
