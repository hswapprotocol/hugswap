import React from 'react'
import styled from 'styled-components'
import { CardProps } from 'rebass'
import { Box } from 'rebass/styled-components'

const Card = styled(Box)<{ padding?: string; border?: string; borderRadius?: string }>`
  width: 100%;
  border-radius: 16px;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`
export default Card

export const LightCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.bg6};
  background-color: ${({ theme }) => theme.bg1};
`

export const BorderCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.bg6};
  border-radius: 8px;
  padding: 1rem;
`

export const GreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.bg3};
`

export const OutlineCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.bg6};
`

export const YellowCard = styled(Card)`
  background-color: rgba(243, 132, 30, 0.05);
  color: ${({ theme }) => theme.yellow2};
  font-weight: 500;
`

export const bg6Card = styled(Card)`
  background-color: ${({ theme }) => theme.bg6};
  color: ${({ theme }) => theme.text7};
  font-weight: 500;
`

export const PinkCard = styled(Card)`
  background-color: rgba(255, 0, 122, 0.03);
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;
`

const BlueCardStyled = styled(Card)`
  // background-color: ${({ theme }) => theme.primary5};
  color: ${({ theme }) => theme.text3};
  border-radius: 12px;
  width: fit-content;
  padding: 0;
`

export const NoBorderCardStyled = styled(Card)`
  color: ${({ theme }) => theme.text4};
  margin: 2rem auto 1.5rem;
  padding: 0;
  max-width: 17.5rem;
`
export const DialogCardStyled = styled(Card)`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text4};
  padding: 1.25rem 1rem;
`

export const BlueCard = ({ children, ...rest }: CardProps) => {
  return <BlueCardStyled {...rest}>{children}</BlueCardStyled>
}
