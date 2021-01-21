import React, { useContext } from 'react'
import { AlertCircle } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useActiveWeb3React } from '../../hooks'
import { TYPE } from '../../theme'
import { ExternalLink } from '../../theme/components'
import { getHecoscanLink } from '../../utils'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'
import { Text, Flex } from 'rebass'
import { ReactComponent as Success } from '../../assets/svg/success.svg'

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

export default function TransactionPopup({
  hash,
  success,
  summary
}: {
  hash: string
  success?: boolean
  summary?: string
}) {
  const { chainId } = useActiveWeb3React()

  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  return (
    <RowNoFlex>
      <AutoColumn gap="8px">
        <Flex>
          {success ? <Success style={{ width: 24, height: 24 }} /> : <AlertCircle color={theme.red1} size={24} />}
          <div style={{ paddingLeft: '10px' }}>
            <TYPE.body fontWeight={500} marginBottom={10}>
              {summary ?? `${t('Hash')}: ` + hash.slice(0, 8) + '...' + hash.slice(58, 65)}
            </TYPE.body>
            {chainId && (
              <Text fontSize={14} color={theme.text4}>
                {t('Go to')}
                <ExternalLink href={getHecoscanLink(chainId, hash, 'transaction')}>&nbsp;{t('Hecoscan')}&nbsp;</ExternalLink>
                {t('to view details')}
              </Text>
            )}
          </div>
        </Flex>
      </AutoColumn>
    </RowNoFlex>
  )
}
