import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { NavLink, Link as HistoryLink } from 'react-router-dom'

import { RowBetween, AutoRow } from '../Row'
import QuestionHelper from '../QuestionHelper'
import { ReactComponent as Back } from '../../assets/images/back.svg'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 20px;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 18px;
  color: ${({ theme }) => theme.text2};
`

const StyledArrowLeft = styled(Back)`
  path {
    stroke: ${({ theme }) => theme.text3};
  }
  width: 9px;
  height: 15px
  &:hover {
    path {
      stroke: ${({ theme }) => theme.text2};
    }
  }
`

export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' }) {
  const { t } = useTranslation()
  return (
    <Tabs style={{ marginBottom: '20px', display: 'none' }}>
      <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'}>
        {t('swap')}
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
        {t('pool')}
      </StyledNavLink>
    </Tabs>
  )
}

export function FindPoolTabs() {
  const { t } = useTranslation()
  return (
    <Tabs>
      <AutoRow style={{ padding: '0.6875rem 0.5rem 1.6875rem' }}>
        <HistoryLink to="/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText style={{ textAlign: 'center', flex: 1 }}>{t('ImportTitle')}</ActiveText>
      </AutoRow>
    </Tabs>
  )
}

export function AddRemoveTabs({ adding, creating }: { adding: boolean; creating: boolean }) {
  const { t } = useTranslation()

  return (
    <Tabs>
      <RowBetween style={{ padding: '0.6875rem 0.5rem 1.6875rem' }}>
        <HistoryLink to="/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText style={adding ? {} : { textAlign: 'center', flex: 1, }}>{creating ? t('createLiquidity') : adding ? t('addLiquiditys') : t('removeLiquiditys')}</ActiveText>
        {
            adding ?
                (<QuestionHelper
                text={t('hint5')}
            />) : ''
        }
        
      </RowBetween>
    </Tabs>
  )
}
