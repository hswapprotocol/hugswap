import { useTranslation } from 'react-i18next'
import React from 'react'
// import { ArrowDown } from 'react-feather'
import beforeImg from '../../assets/images/before.png'
// import { useMedia } from 'react-use'
import { Text } from 'rebass'
import styled from 'styled-components'

// import { HaloWrapper } from '../Pool/index'

const BeforeBody = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: start;
  justify-items: center;
  flex-direction: row;
  width: 100%;
  max-width: 1200px;
`
const Img = styled.img`
  width: 350px;
`

const Content = styled(Text)`
  color: ${({ theme }) => theme.text2}
  font-size: 28px;
  font-weight: 600;
`

const Before = function() {
  const { t } = useTranslation()

  return (
    <BeforeBody>
      <Img src={beforeImg} />
      <Content>{t('before text')}</Content>
    </BeforeBody>
  )
}
export default Before
