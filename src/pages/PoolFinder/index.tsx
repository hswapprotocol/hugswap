import { Currency, ETHER, JSBI, TokenAmount } from '@src/sdk'
import React, { useCallback, useEffect, useState, useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { Text } from 'rebass'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ButtonDropdownLight, ButtonPrimary } from '../../components/Button'
import { NoBorderCardStyled } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import CurrencyLogo from '../../components/CurrencyLogo'
import { FindPoolTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row from '../../components/Row'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import { PairState, usePair } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { usePairAdder } from '../../state/user/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import AppBody from '../AppBody'
import { Dots } from '../Pool/styleds'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1
}


export default function PoolFinder() {
  const { account } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

  const [currency0, setCurrency0] = useState<Currency | null>(ETHER)
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  const { t } = useTranslation()

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
    )

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField]
  )

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false)
  }, [setShowSearch])

  const prerequisiteMessage = (
    <NoBorderCardStyled>
        <Text textAlign="center">
            {!account ? t('hint10') : t('hint9')}
        </Text>
    </NoBorderCardStyled>
  )

  return (
    <AppBody>
      <FindPoolTabs />
      <AutoColumn gap="md">
        <ButtonDropdownLight
          onClick={() => {
            setShowSearch(true)
            setActiveField(Fields.TOKEN0)
          }}
        >
          {currency0 ? (
            <Row>
              <CurrencyLogo currency={currency0} />
              <Text fontWeight={500} fontSize={18} marginLeft={'8px'} color={theme.text2}>
                {currency0.symbol}
              </Text>
            </Row>
          ) : (
            <Text fontWeight={500} fontSize={18} color={theme.text4}>
              {t('selectCurrency')}
            </Text>
          )}
        </ButtonDropdownLight>

        <ButtonDropdownLight
          onClick={() => {
            setShowSearch(true)
            setActiveField(Fields.TOKEN1)
          }}
        >
          {currency1 ? (
            <Row>
              <CurrencyLogo currency={currency1} />
              <Text fontWeight={500} fontSize={18} marginLeft={'8px'} color={theme.text2}>
                {currency1.symbol}
              </Text>
            </Row>
          ) : (
            <Text fontWeight={500} fontSize={18} color={theme.text4}>
              {t('selectCurrency')}
            </Text>
          )}
        </ButtonDropdownLight>

        {hasPosition && (
          <ColumnCenter
            style={{ justifyItems: 'center', backgroundColor: '', padding: '12px 0px 8px', borderRadius: '12px' }}
          >
            <Text textAlign="center" fontWeight={500}>
              {t('Found')}!
            </Text>
            <ButtonPrimary
                style={{ margin: '2rem auto 0'}}
                as={Link}
                to={`/pool`}
            >
                <Text textAlign="center">{t('managePool')}</Text>
            </ButtonPrimary>
          </ColumnCenter>
        )}

        {currency0 && currency1 ? (
          pairState === PairState.EXISTS ? (
            hasPosition && pair ? (
              <MinimalPositionCard pair={pair} border="1px solid #CED0D9" />
            ) : (
                <AutoColumn gap="sm" justify="center">
                    <NoBorderCardStyled>
                        <Text textAlign="center">{t('hint11')}</Text>
                    </NoBorderCardStyled>
                    <ButtonPrimary
                        style={{ marginBottom: '1rem'}}
                        as={Link}
                        to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                    >
                        <Text textAlign="center">{t('addLiquiditys')}</Text>
                    </ButtonPrimary>
                </AutoColumn>
            )
          ) : validPairNoLiquidity ? (
              <AutoColumn gap="sm" justify="center">
                <NoBorderCardStyled>      
                    <Text textAlign="center">{t('noPool')}</Text>
                </NoBorderCardStyled>
                <ButtonPrimary
                    style={{ marginBottom: '1rem'}}
                    as={Link}
                    to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                >
                    <Text textAlign="center">{t('Create pool')}</Text>
                </ButtonPrimary>
              </AutoColumn>
          ) : pairState === PairState.INVALID ? (
              <AutoColumn gap="sm" justify="center">
                <NoBorderCardStyled>      
                    <Text textAlign="center" fontWeight={500}>
                        {t('Invalid pair')}.
                    </Text>
                </NoBorderCardStyled>
              </AutoColumn>
          ) : pairState === PairState.LOADING ? (
              <AutoColumn gap="sm" justify="center">
                <NoBorderCardStyled>      
                    <Text textAlign="center">
                        Loading
                        <Dots />
                    </Text>
                </NoBorderCardStyled>
              </AutoColumn>
          ) : null
        ) : (
          prerequisiteMessage
        )}
      </AutoColumn>

      <CurrencySearchModal
        isOpen={showSearch}
        onCurrencySelect={handleCurrencySelect}
        onDismiss={handleSearchDismiss}
        showCommonBases
        selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
      />
    </AppBody>
  )
}
