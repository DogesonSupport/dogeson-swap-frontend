import React, { useEffect, useState } from 'react'
import { utils } from 'ethers'
import styled from 'styled-components'
import { Text, Flex } from '@pancakeswap-libs/uikit'
import { Redirect } from 'react-router'
import ReactLoading from 'react-loading'
import axios from 'axios'
import Web3 from 'web3'
import { useSelector } from 'react-redux'
import Column from '../../../components/Column'
import { AppState } from '../../../state'

const IconWrapper = styled.div<{ size?: number }>`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  height: ${({ size }) => (size ? `${size}px` : '32px')};
  width: ${({ size }) => (size ? `${size}px` : '32px')};
  span {
    height: ${({ size }) => (size ? `${size}px` : '32px')};
    width: ${({ size }) => (size ? `${size}px` : '32px')};
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    align-items: flex-end;
  }
`

const Container = styled.div`
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 12px 12px 0px 0px;
  overflow-x: auto;
  ::-webkit-scrollbar {
    height: 10px;
  }
`

const StyledWrapper = styled.div`
  padding: 8px 16px 0;
  display: flex;
  flex-direction: column;
  & > div {
    margin: 0 12px 8px 0;
    & > div,
    & > div > div > div {
      &:first-child {
        color: white;
        font-size: 14px;
        line-height: 16px;
        font-weight: 500;
        margin-bottom: 2px;
      }
      &:last-child {
        color: #adb5bd;
        font-weight: bold;
        font-size: 14px;
        line-height: 16px;
      }
    }
    & .success {
      color: #00ac1c;
    }
    & .error {
      color: #ea3943;
    }
    & h2 {
      font-size: 14px;
      line-height: 16px;
      font-weight: bold;
    }
  }
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 0;
    min-width: 500px;
  }
`

export default function CoinStatsBoard() {
  // const theme = useContext(ThemeContext)

  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  const result = Web3.utils.isAddress(input)

  const [alldata, setalldata] = useState({
    address: '',
    price: '',
    change: '',
    volume: '',
    liquidityV2: '',
    liquidityV2BNB: '',
  })

  const [tokenData, setTokenData] = useState<any>(null)

  const [linkIcon, setLinkIcon] = useState(
    'https://r.poocoin.app/smartchain/assets/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/logo.png'
  )

  // const pricedecimal=parseFloat(alldata.price).toFixed(5);
  const changedecimal: any = parseFloat(alldata.change).toFixed(3)
  // const set=Math.sign(changedecimal);
  const volumedecimal = parseFloat(alldata.volume).toFixed(3)
  const liquidityV2decimal = parseFloat(alldata.liquidityV2).toFixed(3)
  const liquidityV2BNBdecimal = parseFloat(alldata.liquidityV2BNB).toFixed(3)

  const getTableData = () => {
    try {
      if (result) {
        axios.post('https://api.sphynxswap.finance/tokenStats', { address: input }).then((response) => {
          setTokenData(response.data)
        })
        axios.post('https://api.sphynxswap.finance/chartStats', { address: input }).then((response) => {
          setalldata(response.data)
          setLinkIcon(
            `https://r.poocoin.app/smartchain/assets/${
              input ? utils.getAddress(input) : '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
            }/logo.png`
          )
        })
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      // console.log("eroor===========>",err.message);
      alert('Invalid Address')
      // <Redirect to="/swap" />
    }
  }
  useEffect(() => {
    getTableData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input])

  return (
    <>
      {/* <div style={{display: 'flex', justifyContent: 'center',alignItems: 'center'}}>
    <ReactLoading type="spin" color="green" height='2%' width='2%'  />
    </div> */}
      <Container>
        <StyledWrapper>
          <Column>
            <Flex>
              {/* { */}
              {/* tokenInfo ? */}
              <IconWrapper size={32}>
                <img src={linkIcon} alt="Coin icon" />
              </IconWrapper>
              {tokenData && (
                <Flex flexDirection="column" justifyContent="center">
                  <Text>{tokenData.symbol}</Text>
                  <Text>{tokenData.marketCap}</Text>
                </Flex>
              )}
            </Flex>
          </Column>
          <Column>
            <Text>Price</Text>
            {/* ${Number(alldata.price).toLocaleString()} */}
            <Text>${alldata.price}</Text>
          </Column>
          <Column>
            <Text>24h Change</Text>
            <Text>
              <h2 className={Math.sign(changedecimal) === -1 ? 'error' : 'success'}> {changedecimal}%</h2>
            </Text>
            {/* <Text>{changedecimal}%</Text> */}
          </Column>
          <Column>
            <Text>24h Volume</Text>
            <Text>${Number(volumedecimal).toLocaleString()}</Text>
          </Column>
          <Column style={{ margin: '0 0 8px 0' }}>
            <Text>Liquidity</Text>
            {/* <Text>{Number(liquidityV2BNBdecimal).toLocaleString()} BNB<span className='success'> (${Number(liquidityV2decimal).toLocaleString()})</span></Text> */}
            <Text>
              {Number(liquidityV2BNBdecimal).toLocaleString()} BNB
              <span className="success"> (${Number(liquidityV2decimal).toLocaleString()})</span>
            </Text>
          </Column>
        </StyledWrapper>
      </Container>
    </>
  )
}
