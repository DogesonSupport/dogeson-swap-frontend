import React, { ReactElement, useContext } from 'react'
import styled from 'styled-components'
import { Button } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { allLanguages } from 'constants/localisation/languageCodes'
import { LanguageContext } from 'hooks/LanguageContext'
import useTheme from 'hooks/useTheme'
import useGetPriceData from 'hooks/useGetPriceData'
import { injected, bsc, walletconnect } from 'connectors'
import { useMenuToggle } from 'state/application/hooks'
import MainLogo from 'assets/images/MainLogo.png'
import { ReactComponent as MenuOpenIcon } from 'assets/svg/icon/MenuOpenIcon.svg'
import { ReactComponent as WalletIcon } from 'assets/svg/icon/WalletIcon.svg'
import { ReactComponent as TwitterIcon } from 'assets/svg/icon/TwitterIcon.svg'
import { ReactComponent as SocialIcon2 } from 'assets/svg/icon/SocialIcon2.svg'
import { ReactComponent as TelegramIcon } from 'assets/svg/icon/TelegramIcon.svg'
import links from './config'

const MenuWrapper = styled.div<{ toggled: boolean }>`
  width: ${(props) => (props.toggled ? '100px' : '320px')};
  background: #1A1A27;
  border-right: 1px solid #AFAFAF;
  display: flex;
  flex-direction: column;
  align-items: center;
  & img {
    width: 140px;
  }
  & p {
    font-size: ${(props) => (props.toggled ? '14px' : '16px')};
    line-height: ${(props) => (props.toggled ? '16px' : '19px')};
    color: white;
  }
`;

const MenuIconWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  & span {
    color: white;
    font-size: 14px;
    line-height: 16px;
    text-transform: uppercase;
  }
  & button {
    background: transparent !important;
    padding: 10px;
  }
`

const MenuContentWrapper = styled.div<{ toggled: boolean }>`
  width: 100%;
  padding: ${(props) => (props.toggled ? '0 8px' : '0 24px')};
`

const WalletHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #F9AC61;
  width: 100%;
  height: 56px;
  padding: 0 48px;
  & div {
    display: flex;
    align-items: center;
    & svg {
      margin: -2px 10px 0 0;
    }
  }
`
const TokenItemWrapper = styled.div<{ toggled: boolean }>`
  background: #5E5D62;
  border-radius: 8px;
  margin-top: 2px;
  display: flex;
  justify-content: space-between;
  padding: ${(props) => (props.toggled ? '4px' : '8px 12px')};
  position: relative;
  & div {
    width: ${(props) => (props.toggled ? '100%' : 'auto')};
  }
  & div p:last-child {
    margin-top: 8px;
  }
  & p {
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
`

const ButtonWrapper = styled.div`
  background: #F9AC61;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 56px;
  border-radius: 8px;
`

const MenuItem = styled.a`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-radius: 10px;
  & p {
    margin-left: 12px;
  }
  &:hover {
    background: #F9AC61;
  }
`
const SocialWrapper = styled.div`
  margin-top: 10px;
  & p {
    margin-left: 12px;
    margin-bottom: 10px;
  }
`

const SocialIconsWrapper = styled.div<{toggled: boolean}>`
  display: flex;
  height: 48px;
  & div {
    display: flex;
    flex-direction: ${(props) => props.toggled ? 'column' : 'row'};
    align-items: center;
    background: rgba(159, 219, 236, 0.2);
    border-radius: 20px;
    & svg {
      margin: 0 11px;
    }
  }
`

const Menu: React.FC = props => {
  const { account, activate, deactivate } = useWeb3React()
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { isDark, toggleTheme } = useTheme()
  const cakePriceUsd = useGetPriceData()
  const { menuToggled, toggleMenu } = useMenuToggle();

  const tokenData = [
    {
      name: 'GLend',
      rate: '1.10881',
      price1: '0.10088233231',
      price2: '0.10001'
    },
    {
      name: 'DOOOG',
      rate: '1.10881',
      price1: '0.10088233231',
      price2: '0.10001'
    },
    {
      name: 'FUDOFF',
      rate: '1.10881',
      price1: '0.10088233231',
      price2: '0.10001'
    },
    {
      name: 'NEWWORLD',
      rate: '1.10881',
      price1: '0.10088233231',
      price2: '0.10001'
    }
  ]

  return (
    <MenuWrapper toggled={menuToggled}>
      <img src={MainLogo} alt='Main Logo' />
      <MenuIconWrapper>
        {!menuToggled && <span>Main Menu</span>
        }
        <Button onClick={() => { toggleMenu(!menuToggled) }}>
          <MenuOpenIcon />
        </Button>
      </MenuIconWrapper>
      <WalletHeading>
        <div>
          <WalletIcon />
          {
            !menuToggled && <p>Wallet</p>
          }
        </div>
        {!menuToggled && <p><b>$ 0.014</b></p>
        }
      </WalletHeading>
      <MenuContentWrapper toggled={menuToggled}>
        {
          tokenData.map((item) => (
            <TokenItemWrapper toggled={menuToggled}>
              <div>
                <p><b>{ item.name }</b></p>
                <p><b>${ item.price1 }</b></p>
              </div>
              {
                !menuToggled &&
                <div>
                  <p><b>{ item.rate }</b></p>
                  <p><b>${ item.price2 }</b></p>
                </div>
              }
            </TokenItemWrapper>
          ))
        }
        <ButtonWrapper style={{ margin: '10px 0' }}>
          <p><b>Show All Tokens</b></p>
        </ButtonWrapper>
        {
          links.map((link) => {
            const Icon = link.icon
            return (
              <MenuItem href={link.href} target='_blank'>
                <Icon />
                {
                  !menuToggled && <p><b>{ link.label }</b></p>
                }
              </MenuItem>
          )})
        }
        <SocialWrapper>
          <p><b>Socials</b></p>
          <SocialIconsWrapper toggled={menuToggled}>
            <div>
              <TwitterIcon />
              <SocialIcon2 />
              <TelegramIcon />
            </div>
          </SocialIconsWrapper>
        </SocialWrapper>
      </MenuContentWrapper>
      {/* <UikitMenu
        links={links}
        priceLink="https://www.coingecko.com/en/coins/goose-finance"
        account={account as string}
        login={(connectorId: ConnectorId) => {
          if (connectorId === 'walletconnect') {
            return activate(walletconnect)
          }

          if (connectorId === 'bsc') {
            return activate(bsc)
          }

          return activate(injected)
        }}
        logout={deactivate}
        isDark={isDark}
        toggleTheme={toggleTheme}
        currentLang={selectedLanguage?.code || ''}
        langs={allLanguages}
        setLang={setSelectedLanguage}
        cakePriceUsd={cakePriceUsd}
        {...props}
      /> */}
    </MenuWrapper>
  )
}

export default Menu
