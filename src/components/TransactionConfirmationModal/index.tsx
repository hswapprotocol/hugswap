import { ChainId } from '@src/sdk'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'
import Modal from '../Modal'
import { ExternalLink } from '../../theme'
import { Text, Flex } from 'rebass'
import { CloseIcon, CustomLightSpinner } from '../../theme/components'
import { RowBetween } from '../Row'
import { AlertTriangle } from 'react-feather'
import { ButtonPrimary } from '../Button'
import { AutoColumn, ColumnCenter } from '../Column'
import Circle from '../../assets/images/blue-loader.svg'
import { ReactComponent as Success } from '../../assets/svg/success.svg'

import { getHecoscanLink } from '../../utils'
import { useActiveWeb3React } from '../../hooks'

const Wrapper = styled.div`
  width: 100%;
`
const Section = styled(AutoColumn)`
  padding: 24px 24px 32px 24px;
`
const TopSection = styled(AutoColumn)`
  padding: 24px 24px 20px 24px;
`

const BottomSection = styled(Section)`
  padding-top: 0;
  // background-color: ${({ theme }) => theme.bg2};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 20px 0 40px;
`

function ConfirmationPendingContent({ onDismiss, pendingText }: { onDismiss: () => void; pendingText: string }) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  return (
    <Wrapper>
      <Section>
        <ConfirmedIcon>
          <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={'center'}>
          <Text fontWeight={500} fontSize={20}>
            {t('Confirming')}…
          </Text>
          <AutoColumn gap="12px" justify={'center'}>
            <Text fontWeight={600} fontSize={14} color={theme.text3} textAlign="center">
              {pendingText}
            </Text>
          </AutoColumn>
          <Text fontSize={12} color={theme.text4} textAlign="center">
            {t('You can confirm the transaction on the wallet')}
          </Text>
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
}) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)

  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <div />
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <ConfirmedIcon>
          <Success />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={'center'}>
          <Text fontWeight={500} fontSize={20}>
            {t('Submitted successfully')}
          </Text>
          {chainId && hash && (
            <Flex alignItems="center">
              <Text fontWeight={500} fontSize={14} color={theme.text3}>
                {t('Go to Hecoscan to')}{' '}
              </Text>

              <ExternalLink href={getHecoscanLink(chainId, hash, 'transaction')}>
                <Text fontWeight={500} fontSize={14} color={theme.text11}>
                  &nbsp;{t('view transaction details')}
                </Text>
              </ExternalLink>
            </Flex>
          )}
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

export function ConfirmationModalContent({
  title,
  bottomContent,
  onDismiss,
  topContent
}: {
  title: string
  onDismiss: () => void
  topContent: () => React.ReactNode
  bottomContent: () => React.ReactNode
}) {
  return (
    <Wrapper>
      <TopSection>
        <RowBetween>
          <Text fontWeight={500} fontSize={20}>
            {title}
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        {topContent()}
      </TopSection>
      <BottomSection gap="12px">{bottomContent()}</BottomSection>
    </Wrapper>
  )
}

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <Text fontWeight={500} fontSize={20}>
            {t('Error')}
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <AutoColumn style={{ marginTop: 20, padding: '2rem 0' }} gap="24px" justify="center">
          <AlertTriangle color={theme.red1} style={{ strokeWidth: 1.5 }} size={64} />
          <Text fontWeight={500} fontSize={16} color={theme.red1} style={{ textAlign: 'center', width: '85%' }}>
            {message}
          </Text>
        </AutoColumn>
      </Section>
      <BottomSection gap="12px">
        <ButtonPrimary onClick={onDismiss}>{t('Dismiss')}</ButtonPrimary>
      </BottomSection>
    </Wrapper>
  )
}

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash: string | undefined
  content: () => React.ReactNode
  attemptingTxn: boolean
  pendingText: string
}

export default function TransactionConfirmationModal({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content
}: ConfirmationModalProps) {
  const { chainId } = useActiveWeb3React()

  if (!chainId) return null

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent chainId={chainId} hash={hash} onDismiss={onDismiss} />
      ) : (
        content()
      )}
    </Modal>
  )
}
