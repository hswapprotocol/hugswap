import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Pair, JSBI } from '@src/sdk'
import { Link } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import FullPositionCard from '../../components/PositionCard'
import { useUserHasLiquidityInAllTokens } from '../../data/V1'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { StyledInternalLink, TYPE } from '../../theme'
import { Text } from 'rebass'
import Card from '../../components/Card'
import { RowFixed } from '../../components/Row'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { Dots } from '../../components/swap/styleds'
import { useStakingInfo } from '../../state/stake/hooks'
import { BIG_INT_ZERO } from '../../constants'
import { BodyWrapper } from '../AppBody'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const HaloWrapper = styled.div`
  position: relative;
  &:before,
  &:after,
  & > div:first-child:after {
    content: '';
    display: block;
    position: absolute;
    z-index: 2;
    pointer-events: none;

    border-radius: 50%;
    width: 150px;
    height: 150px;
  }
  &:before {
    left: 16.32%;
    right: 56.74%;
    top: 30.74%;
    bottom: 60%;
    opacity: 0.36;
    border: 50px solid #4100ff;
    box-sizing: border-box;
    filter: blur(111px);
  }
  &:after {
    left: 55.9%;
    right: 33.89%;
    top: -10%;
    bottom: 80%;
    background: #000aff;
    opacity: 0.12;
    border: 50px solid #000aff;
    box-sizing: border-box;
    filter: blur(120px);
  }
  & > div:first-child::after {
    left: 57.22%;
    right: 32.85%;
    top: 43.98%;
    bottom: 42.78%;
    opacity: 0.09;
    border: 50px solid #ff00c7;
    box-sizing: border-box;
    filter: blur(120px);
  }
`

const AppBodyWrapper = styled(BodyWrapper)`
  max-width: 100%;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
  width: 640px !important;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100% !important;
  `};
`

const ButtonRow = styled(RowFixed)`
  width: 100%;
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
  `};
`

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  margin-left: 0.8rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  width: fit-content;
  border-color: ${({ theme }) => theme.text6}
    ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
  &:hover {
    border-color: ${({ theme }) => theme.text7};
  }
`

const EmptyProposals = styled.div`
  padding: 26px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function Pool() {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const hasV1Liquidity = useUserHasLiquidityInAllTokens()

  // show liquidity even if its deposited in rewards contract
  const stakingInfo = useStakingInfo()
  const stakingInfosWithBalance = stakingInfo?.filter(pool => JSBI.greaterThan(pool.stakedAmount.raw, BIG_INT_ZERO))
  const stakingPairs = usePairs(stakingInfosWithBalance?.map(stakingInfo => stakingInfo.tokens))

  // remove any pairs that also are included in pairs with stake in mining pool
  const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter(v2Pair => {
    return (
      stakingPairs
        ?.map(stakingPair => stakingPair[1])
        .filter(stakingPair => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
    )
  })

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs active={'pool'} />
        <HaloWrapper>
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <AppBodyWrapper>
              <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                {t('liquidityReward')}
              </TYPE.mediumHeader>
              <TYPE.subHeader color={theme.text4} marginTop="0.5rem" marginBottom="1rem" textAlign="left">
                {t('liquidityContent')}
              </TYPE.subHeader>
              <ButtonRow justify="flex-end">
                <ResponsiveButtonSecondary as={Link} padding="6px 18px" to="/create/HT">
                  <Text fontWeight={500} fontSize={14}>
                  {t('createLiquidity')}
                  </Text>
                </ResponsiveButtonSecondary>
                <ResponsiveButtonPrimary id="join-pool-button" as={Link} padding="6px 18px" to="/add/HT">
                  <Text fontWeight={500} fontSize={14}>
                    {t('addLiquiditys')}
                  </Text>
                </ResponsiveButtonPrimary>
              </ButtonRow>
            </AppBodyWrapper>

            <AppBodyWrapper>
              <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                {t('myLiquidity')}
              </TYPE.mediumHeader>
              {!account ? (
                <Card padding="40px">
                  <TYPE.body color={theme.text3} textAlign="center">
                    {t('connectHint')}
                  </TYPE.body>
                </Card>
              ) : v2IsLoading ? (
                <EmptyProposals>
                  <TYPE.body color={theme.text3} textAlign="center">
                    <Dots>Loading</Dots>
                  </TYPE.body>
                </EmptyProposals>
              ) : allV2PairsWithLiquidity?.length > 0 || stakingPairs?.length > 0 ? (
                <>
                  {v2PairsWithoutStakedAmount.map(v2Pair => (
                    <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                  ))}
                  {stakingPairs.map(
                    (stakingPair, i) =>
                      stakingPair[1] && ( // skip pairs that arent loaded
                        <FullPositionCard
                          key={stakingInfosWithBalance[i].stakingRewardAddress}
                          pair={stakingPair[1]}
                          stakedBalance={stakingInfosWithBalance[i].stakedAmount}
                        />
                      )
                  )}
                </>
              ) : (
                <EmptyProposals>
                  <TYPE.body color={theme.text3} textAlign="center">
                    {t('noLiquiditys')}
                  </TYPE.body>
                </EmptyProposals>
              )}
              <AutoColumn justify={'center'} gap="md">
                <Text textAlign="center" fontSize={14} style={{ padding: '.5rem 0 .5rem 0', marginTop: 20 }}>
                  {hasV1Liquidity ? t('foundLiquidity') : t('noLiquidityHint')}{' '}
                  <StyledInternalLink id="import-pool-link" to={hasV1Liquidity ? '/migrate/v1' : '/find'}>
                    {hasV1Liquidity ? t('migrate') : t('import')}
                  </StyledInternalLink>
                </Text>
              </AutoColumn>
            </AppBodyWrapper>
          </AutoColumn>
        </HaloWrapper>
      </PageWrapper>
    </>
  )
}
