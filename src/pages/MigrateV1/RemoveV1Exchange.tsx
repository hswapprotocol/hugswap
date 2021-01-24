import { TransactionResponse } from '@ethersproject/abstract-provider'
import { JSBI, Token, TokenAmount, WHT, Fraction, Percent, CurrencyAmount } from '@src/sdk'
import { useTranslation } from 'react-i18next'
import React, { useCallback, useMemo, useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { ButtonConfirmed } from '../../components/Button'
import { LightCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import QuestionHelper from '../../components/QuestionHelper'
import { AutoRow } from '../../components/Row'
import { DEFAULT_DEADLINE_FROM_NOW } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { useToken } from '../../hooks/Tokens'
import { useV1ExchangeContract } from '../../hooks/useContract'
import { NEVER_RELOAD, useSingleCallResult } from '../../state/multicall/hooks'
import { useIsTransactionPending, useTransactionAdder } from '../../state/transactions/hooks'
import { useTokenBalance, useHTBalances } from '../../state/wallet/hooks'
import { BackArrow, TYPE } from '../../theme'
import { isAddress } from '../../utils'
import { BodyWrapper } from '../AppBody'
import { EmptyState } from './EmptyState'
import { V1LiquidityInfo } from './MigrateV1Exchange'
import { AddressZero } from '@ethersproject/constants'
import { Dots } from '../../components/swap/styleds'
import { Contract } from '@ethersproject/contracts'
import { useTotalSupply } from '../../data/TotalSupply'

const WEI_DENOM = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))
const ZERO = JSBI.BigInt(0)
const ONE = JSBI.BigInt(1)
const ZERO_FRACTION = new Fraction(ZERO, ONE)

function V1PairRemoval({
  exchangeContract,
  liquidityTokenAmount,
  token
}: {
  exchangeContract: Contract
  liquidityTokenAmount: TokenAmount
  token: Token
}) {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const totalSupply = useTotalSupply(liquidityTokenAmount.token)
  const exchangeHTBalance = useHTBalances([liquidityTokenAmount.token.address])?.[liquidityTokenAmount.token.address]
  const exchangeTokenBalance = useTokenBalance(liquidityTokenAmount.token.address, token)

  const [confirmingRemoval, setConfirmingRemoval] = useState<boolean>(false)
  const [pendingRemovalHash, setPendingRemovalHash] = useState<string | null>(null)

  const shareFraction: Fraction = totalSupply ? new Percent(liquidityTokenAmount.raw, totalSupply.raw) : ZERO_FRACTION

  const ethWorth: CurrencyAmount = exchangeHTBalance
    ? CurrencyAmount.ether(exchangeHTBalance.multiply(shareFraction).multiply(WEI_DENOM).quotient)
    : CurrencyAmount.ether(ZERO)

  const tokenWorth: TokenAmount = exchangeTokenBalance
    ? new TokenAmount(token, shareFraction.multiply(exchangeTokenBalance.raw).quotient)
    : new TokenAmount(token, ZERO)

  const addTransaction = useTransactionAdder()
  const isRemovalPending = useIsTransactionPending(pendingRemovalHash ?? undefined)

  const remove = useCallback(() => {
    if (!liquidityTokenAmount) return

    setConfirmingRemoval(true)
    exchangeContract
      .removeLiquidity(
        liquidityTokenAmount.raw.toString(),
        1, // min_eth, this is safe because we're removing liquidity
        1, // min_tokens, this is safe because we're removing liquidity
        Math.floor(new Date().getTime() / 1000) + DEFAULT_DEADLINE_FROM_NOW
      )
      .then((response: TransactionResponse) => {
        // ReactGA.event({
        //   category: 'Remove',
        //   action: 'V1',
        //   label: token?.symbol
        // })
        //remove ReactGA, extract the inner logic
        //TODO: integrate with woodpecker

        addTransaction(response, {
          summary: `Remove ${chainId && token.equals(WHT[chainId]) ? 'WHT' : token.symbol}/HT V1 liquidity`
        })
        setPendingRemovalHash(response.hash)
      })
      .catch((error: Error) => {
        console.error(error)
        setConfirmingRemoval(false)
      })
  }, [exchangeContract, liquidityTokenAmount, token, chainId, addTransaction])

  const noLiquidityTokens = !!liquidityTokenAmount && liquidityTokenAmount.equalTo(ZERO)

  const isSuccessfullyRemoved = !!pendingRemovalHash && noLiquidityTokens

  return (
    <AutoColumn gap="20px">
      <TYPE.body my={9} style={{ fontWeight: 400 }}>
        {t('hint40')}
      </TYPE.body>

      <LightCard>
        <V1LiquidityInfo
          token={token}
          liquidityTokenAmount={liquidityTokenAmount}
          tokenWorth={tokenWorth}
          ethWorth={ethWorth}
        />

        <div style={{ display: 'flex', marginTop: '1rem' }}>
          <ButtonConfirmed
            confirmed={isSuccessfullyRemoved}
            disabled={isSuccessfullyRemoved || noLiquidityTokens || isRemovalPending || confirmingRemoval}
            onClick={remove}
          >
            {isSuccessfullyRemoved ? t('Success') : isRemovalPending ? <Dots>{t('Removing')}</Dots> : t('remove')}
          </ButtonConfirmed>
        </div>
      </LightCard>
      <TYPE.darkGray style={{ textAlign: 'center' }}>
        {t('UniswapAssets', {symbol: chainId && token.equals(WHT[chainId]) ? 'WHT' : token.symbol})}
      </TYPE.darkGray>
    </AutoColumn>
  )
}

export default function RemoveV1Exchange({
  match: {
    params: { address }
  }
}: RouteComponentProps<{ address: string }>) {
  const validatedAddress = isAddress(address)
  const { t } = useTranslation()
  const { chainId, account } = useActiveWeb3React()

  const exchangeContract = useV1ExchangeContract(validatedAddress ? validatedAddress : undefined, true)
  const tokenAddress = useSingleCallResult(exchangeContract, 'tokenAddress', undefined, NEVER_RELOAD)?.result?.[0]
  const token = useToken(tokenAddress)

  const liquidityToken: Token | undefined = useMemo(
    () =>
      validatedAddress && chainId && token
        ? new Token(chainId, validatedAddress, 18, `UNI-V1-${token.symbol}`, 'Uniswap V1')
        : undefined,
    [chainId, validatedAddress, token]
  )
  const userLiquidityBalance = useTokenBalance(account ?? undefined, liquidityToken)

  // redirect for invalid url params
  if (!validatedAddress || tokenAddress === AddressZero) {
    console.error(t('Invalid address in path'), address)
    return <Redirect to="/migrate/v1" />
  }

  return (
    <BodyWrapper style={{ padding: 24 }} id="remove-v1-exchange">
      <AutoColumn gap="16px">
        <AutoRow style={{ alignItems: 'center', justifyContent: 'space-between' }} gap="8px">
          <BackArrow to="/migrate/v1" />
          <TYPE.mediumHeader>{t('Remove V1 Liquidity')}</TYPE.mediumHeader>
          <div>
            <QuestionHelper text={t('hint41')} />
          </div>
        </AutoRow>

        {!account ? (
          <TYPE.largeHeader>{t('You must connect an account.')}</TYPE.largeHeader>
        ) : userLiquidityBalance && token && exchangeContract ? (
          <V1PairRemoval
            exchangeContract={exchangeContract}
            liquidityTokenAmount={userLiquidityBalance}
            token={token}
          />
        ) : (
          <EmptyState message="Loading..." />
        )}
      </AutoColumn>
    </BodyWrapper>
  )
}
