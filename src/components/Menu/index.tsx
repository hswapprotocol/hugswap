import React, { useRef } from 'react'
import { Code, Twitter, Info, Send } from 'react-feather'
import styled from 'styled-components'
// import TwitterIcon from '../../assets/svg/twitter.svg'
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
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
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
    top: -17.25rem;
    min-width: 8.125rem;
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
  > svg, img {
    margin-right: 8px;
  }
`

const CODE_LINK = 'https://github.com/hswapprotocol/hugswap'

export default function Menu() {

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
          <MenuItem id="link" href="https://hugswap.com/">
            <Info size={14} />
            About
          </MenuItem>
          <MenuItem id="link" href={CODE_LINK}>
            <Code size={14} />
            Code
          </MenuItem>
          <MenuItem id="link" href="/#/">
            <Twitter size={14} />
            Twitter
          </MenuItem>
          <MenuItem id="link" href="/#/">
            <Send size={14} />
            Telegram
          </MenuItem>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
