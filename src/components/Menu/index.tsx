import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Code, Twitter, Info, Send } from 'react-feather'
import styled from 'styled-components'
import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'

import { ExternalLink } from '../../theme'

const StyledMenuIcon = styled(MenuIcon)`
  :hover {
    path {
      stroke: ${({ theme }) => theme.text3};
    }
  }
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;

  padding: 0.15rem 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 10.375rem;
  background-color: ${({ theme }) => theme.bg1};
  box-shadow: ${({ theme }) => theme.shadow};
  border-radius: 12px;
  padding: 0.6875rem 0;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 2.415rem;
  right: 0rem;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: -14rem;
  `};
`

const MenuItem = styled(ExternalLink)`
  flex: 1;
  padding: 0.875rem 1.0625rem;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    background-color: ${({ theme }) => theme.bg5};
    cursor: pointer;
    text-decoration: none;
  }
  > svg,
  img {
    margin-right: 8px;
  }
`

const CODE_LINK = 'https://github.com/hswapprotocol'

export default function Menu() {
  const { t } = useTranslation()

  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        <StyledMenuIcon />
      </StyledMenuButton>

      {open && (
        <MenuFlyout>
          <MenuItem id="link" href="/#/">
            <Info size={14} />
            {t('about')}
          </MenuItem>
          <MenuItem id="link" href={CODE_LINK}>
            <Code size={14} />
            {t('code')}
          </MenuItem>
          <MenuItem id="link" href="https://twitter.com/hugswap">
            <Twitter size={14} />
            {t('twitter')}
          </MenuItem>
          <MenuItem id="link" href="https://t.me/hugswap">
            <Send size={14} />
            {t('telegram')}
          </MenuItem>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
