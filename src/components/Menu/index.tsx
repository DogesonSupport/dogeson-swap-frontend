/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { ReactElement, useContext, useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { allLanguages } from 'constants/localisation/languageCodes'
import { LanguageContext } from 'hooks/LanguageContext'
import useTheme from 'hooks/useTheme'
import useGetPriceData from 'hooks/useGetPriceData'
import { injected, bsc, walletconnect } from 'connectors'
import { useMenuToggle } from 'state/application/hooks'
import MainLogo from 'assets/svg/logo_new.svg'
import { useDispatch } from 'react-redux'

import CopyHelper from 'components/AccountDetails/Copy'
import Illustration from 'assets/images/Illustration.svg'
import { ReactComponent as MenuOpenIcon } from 'assets/svg/icon/MenuOpenIcon.svg'
import { ReactComponent as WalletIcon } from 'assets/svg/icon/WalletIcon.svg'
import { ReactComponent as TwitterIcon } from 'assets/svg/icon/TwitterIcon.svg'
import { ReactComponent as SocialIcon2 } from 'assets/svg/icon/SocialIcon2.svg'
import { ReactComponent as TelegramIcon } from 'assets/svg/icon/TelegramIcon.svg'
import Web3 from 'web3';
import axios from 'axios'
import { typeInput } from '../../state/input/actions'
import links from './config'


const MenuWrapper = styled.div<{ toggled: boolean }>`
  width: 320px;
  background: #1A1A27;
  border-right: 1px solid #AFAFAF;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  left: ${(props) => (props.toggled ? '-320px' : 0)};
  transition: left 0.5s;
  z-index: 2;
  height: 100vh;
  & img {
    width: 140px;
  }
  & p {
    font-size: 16px;
    line-height: 19px;
    color: white;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    left: 0;
    width: ${(props) => (props.toggled ? '100px' : '320px')};
    & p {
      font-size: ${(props) => (props.toggled ? '14px' : '16px')};
      line-height: ${(props) => (props.toggled ? '16px' : '19px')};  
    }
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
    & svg path {
      fill: white;
    }
  }
`

const MenuContentWrapper = styled.div<{ toggled: boolean }>`
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding: 0 24px 32px;
  ${({ theme }) => theme.mediaQueries.xl} {
    padding: ${(props) => (props.toggled ? '0 8px' : '0 24px')};
  }
`

const WalletHeading = styled.div<{ toggled: boolean }>`
  display: flex;
  justify-content: ${(props) => props.toggled ? 'center' : 'space-between'};
  align-items: center;
  background: #8B2A9B;
  width: 100%;
  height: 56px;
  padding: ${(props) => props.toggled ? '0' : '0 48px'};
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
  cursor: pointer;
  & > div:first-child {
    width: ${(props) => (props.toggled ? '100%' : '66%')};
  }
  & > div:last-child {
    width: ${(props) => (props.toggled ? '100%' : '32%')};
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
  background: #8B2A9B;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 56px;
  border-radius: 8px;
  cursor: pointer;
`

const MenuItem = styled.a`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-radius: 10px;
  text-decoration: none !important;
  & p {
    margin-left: 12px;
  }
  &:hover {
    background: #8B2A9B;
  }
`
const SocialWrapper = styled.div`
  margin: 10px 0 32px;
  & p {
    margin-left: 12px;
    margin-bottom: 10px;
  }
`

const TokenListWrapper = styled.div`
  overflow-y: auto;
  max-height: 330px;
`

const SocialIconsWrapper = styled.div<{ toggled: boolean }>`
  display: flex;
  height: ${(props) => props.toggled ? 'auto' : '48px'};
  & div {
    display: flex;
    width: ${(props) => props.toggled ? '100%' : 'auto'};
    flex-direction: ${(props) => props.toggled ? 'column' : 'row'};
    align-items: center;
    background: rgba(159, 219, 236, 0.2);
    border-radius: 20px;
    & svg {
      margin: ${(props) => props.toggled ? '11px 0' : '0 11px'};
    }
  }
`

const IllustrationWrapper = styled.div`
  width: 100%;
  margin-left: -24px;
  & img {
    width: 100%;
  }
`

const Menu: React.FC = props => {
  const { account, activate, deactivate } = useWeb3React()
  // const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  // const { isDark, toggleTheme } = useTheme()
  // const cakePriceUsd = useGetPriceData()
  const { menuToggled, toggleMenu } = useMenuToggle();
  const [showAllToken, setShowAllToken] = useState(true);

  const [walletbalance, setWalletBalance] = useState(0);
  const dispatch = useDispatch();

  const [sum, setSum] = useState(0);
  const [getallToken, setAllTokens] = useState([]);




  // const getAccount= new web3.eth.Iban('account');
  // const getBalance= async()=>{

  // const balance = await  web3.eth.getBalance('account'); 
  //     setWalletBalance(balance);
  // }

  // useEffect(()=>{
  //   getBalance() 
  // }); 

  // const Balance= ()=>{

  //   const testnet = 'https://bsc-dataseed1.defibit.io';
  //   const web3 = new Web3(new Web3.providers.HttpProvider(testnet));
  //   const balance= account && web3.eth.getBalance(account).then((res : any)=>{
  //   setWalletBalance(res/1000000000000000000);
  //    })
  // }

  const Get_data = `
  {
    ethereum(network: bsc) {
      address(address: {is: "${account}" }){
        balances {
          value
          currency {
            address
            symbol
            tokenType 
          }
        }
      }
    }
  }`


  // const [address,setAddress]=useState<any>([])
  // console.log("addressssssss=>>>>>>>>:::::::::::::::::::::::",address)
  const fetchData = async () => {
    if (account) {


      // const g= await axios.get('https://api.sphynxswap.finance/price/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82');
      // // eslint-disable-next-line no-console
      // console.log("price============>",g);

      const queryResult = await axios.post('https://graphql.bitquery.io/', { query: Get_data });
      // const addres=setAddress(queryResult.data.data.ethereum.address[0].balances.currency.address)
      // console.log("address============>",addres);
      if (queryResult.data.data) {
        // queryResult.data.data.ethereum.address[0].balances.forEach(async (elem, index)=>{
        let allsum: any = 0;

        // eslint-disable-next-line no-restricted-syntax
        for (const elem of queryResult.data.data.ethereum.address[0].balances) {

          const price: any = await axios.get(`https://api.sphynxswap.finance/price/${elem.currency.address === '-' ? '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' : elem.currency.address}`);
          const dollerprice: any = price.data.price * elem.value;
          elem.dollarPrice = dollerprice;
          allsum += dollerprice;

          // eslint-disable-next-line no-console
          
        }
        
        // })
        
        setSum(allsum)
        setAllTokens(queryResult.data.data.ethereum.address[0].balances)

      }


    }
  }

  // const getPrice=async ()=>{
  //   const g= await axios.get('https://api.sphynxswap.finance/price/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82');
  //   // eslint-disable-next-line no-console
  //   console.log("price============>",g);
  // }

  //     const chartData =[]
  //     result.forEach(e =>{
  //        chartData.push({
  //            open : parseFloat(e.open_price),
  //            high : parseFloat(e.maximum_price),
  //            low : parseFloat(e.minimum_price),
  //            close: parseFloat(e.close_price),
  //            // time : e.timeInterval.minute
  //            // time : "2021-04-12"
  //        })
  //    })

  // };

  useEffect(() => {
    fetchData()
    // Balance();


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])




  const token_data = getallToken.map((elem: any) => {
    const { currency, value, dollarPrice } = elem;
    //  const link = `https://bscscan.com/token/${currency.address}`

    return (
      <>
        <TokenItemWrapper toggled={menuToggled} onClick={() => { dispatch(typeInput({ input: currency.address })) }}>
          <div>
            <p><b>{currency.symbol}</b></p>
            <p><b>${Number(dollarPrice).toLocaleString()}</b></p>
          </div>
          <div>
            <p><b>{value}</b></p>
            <p />
          </div>
          {/* {
                  !menuToggled &&
                  <div>
                    <p><b>{currency.symbol }</b></p>
                    <p><b>${ value}</b></p>
                  </div>

                } */}

        </TokenItemWrapper>


      </>

    )
  })



  return (
    <MenuWrapper toggled={menuToggled}>
      <a href="sphynxtoken.co"><img src={MainLogo} alt='Main Logo' /></a>
      <MenuIconWrapper>
        {!menuToggled && <span>Main Menu</span>
        }
        <Button onClick={() => { toggleMenu(!menuToggled) }}>
          {menuToggled ?
            <svg viewBox='0 0 24 24' width='24px'>
              <path d="M4 18H20C20.55 18 21 17.55 21 17C21 16.45 20.55 16 20 16H4C3.45 16 3 16.45 3 17C3 17.55 3.45 18 4 18ZM4 13H20C20.55 13 21 12.55 21 12C21 11.45 20.55 11 20 11H4C3.45 11 3 11.45 3 12C3 12.55 3.45 13 4 13ZM3 7C3 7.55 3.45 8 4 8H20C20.55 8 21 7.55 21 7C21 6.45 20.55 6 20 6H4C3.45 6 3 6.45 3 7Z" />
            </svg>
            :
            <MenuOpenIcon />
          }
        </Button>
      </MenuIconWrapper>
      <WalletHeading toggled={menuToggled}>
        <div>
          <WalletIcon />
          {
            !menuToggled && <p>Wallet</p>
          }
        </div>
        {!menuToggled && <p><b>{account ? Number(sum).toLocaleString() : ""}</b></p>
        }
      </WalletHeading>
      <MenuContentWrapper toggled={menuToggled}>

        {
          account ?
            <div>
              <TokenListWrapper>
                {showAllToken ? token_data : token_data.slice(0, 3)}
              </TokenListWrapper>
              <ButtonWrapper style={{ margin: '10px 0' }} onClick={() => { setShowAllToken(!showAllToken) }}>
                <p><b>{showAllToken ? 'Show Some Tokens' : 'Show All Tokens'}</b></p>
              </ButtonWrapper>
            </div>
            : ""

        }

        {
          links.map((link) => {
            const Icon = link.icon
            return (
              <MenuItem href={link.href}>
                <Icon />
                {
                  !menuToggled && <p><b>{link.label}</b></p>
                }
              </MenuItem>
            )
          })
        }
        <SocialWrapper>
          <p><b>Socials</b></p>
          <SocialIconsWrapper toggled={menuToggled}>
            <div>
              {/* <TwitterIcon />
              <SocialIcon2 />
              <TelegramIcon /> */}
              <a href="https://mobile.twitter.com/sphynxswap" target="blank"><TwitterIcon /></a>
              <a href="sphynxtoken.co" target="blank"><SocialIcon2 /></a>
              <a href="https://t.me/sphynxswap" target="blank"><TelegramIcon /></a>
            </div>
          </SocialIconsWrapper>
        </SocialWrapper>
        {!menuToggled &&
          <IllustrationWrapper>
            <img src={Illustration} alt='Illustration' />
          </IllustrationWrapper>
        }
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
