import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text } from '@pancakeswap-libs/uikit'

// eslint-disable-next-line import/no-unresolved
import { ReactComponent as MoreIcon2 } from 'assets/svg/icon/MoreIcon2.svg'
import axios from 'axios';
import Web3 from 'web3';
import { useSelector, useDispatch } from 'react-redux';

import { AppState, AppDispatch } from '../../../state'
import { selectCurrency, Field } from '../../../state/swap/actions';

// eslint-disable-next-line import/no-cycle

const TextWrapper = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 20px;
  word-break: break-all;
  & > div:first-child {
    color: white;
    font-size: 16px;
    line-height: 19px;
    font-weight: 500;
  }
  & > div:last-child {
    font-size: 14px;
    line-height: 16px;
    color: #ADB5BD;
    margin-top: 2px;
  }
`

const IconWrapper = styled.div<{ size?: number }>`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  & > img,
  span {
    height: ${({ size }) => (size ? `${size}px` : '32px')};
    width: ${({ size }) => (size ? `${size}px` : '32px')};
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    align-items: flex-end;
  }
`

const TokenInfoContainer = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  margin: 12px 0;
  ${({ theme }) => theme.mediaQueries.md} {
    margin: 0;
  }
`
// {tokenInfo}: {tokenInfo?: TokenDetailProps | null}
export default function TokenInfo() {

  //  const input= localStorage.getItem('InputAddress');
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  const result = Web3.utils.isAddress(input)
  // eslint-disable-next-line no-console

  const dispatch = useDispatch<AppDispatch>()

  const [alldata, setalldata] = useState({
    holders: '',
    txs: '',
    marketCap: '',
    symbol: '',
    totalSupply: ''
  });

  const getTableData =async  () => {
    try {

      if (result) {
        await axios.post("https://api.sphynxswap.finance/tokenStats", { address: input })
          .then((response) => {
            setalldata(response.data)
              dispatch(
              selectCurrency({
                field : Field.INPUT,
                currencyId : input
              })
            )
          });
      }

    }
    catch (err) {
      // eslint-disable-next-line no-console
      // console.log(err);
      // alert("Invalid Address")


    }

  }


  useEffect(() => {

    getTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input])

  return (
    <TokenInfoContainer>
      <Flex alignItems="center" justifyContent='space-between'>
        <Flex alignItems='center'>

          <IconWrapper size={32}>
            <Text>{alldata.symbol}</Text>
          </IconWrapper>
        </Flex>
        <Flex style={{ width: 40 }}>
          <MoreIcon2 />
        </Flex>
      </Flex>
      <Flex flexDirection="column">
        <TextWrapper>
          <Text>Total Supply</Text>
          <Text>{alldata.totalSupply}</Text>
        </TextWrapper>
        <TextWrapper>
          <Text>Market Cap:<span style={{ fontSize: '70%' }}>(includes locked, excludes burned)</span></Text>
          <Text>{alldata.marketCap}</Text>
        </TextWrapper>
        <TextWrapper>
          <Text>Transactions</Text>
          <Text>{alldata.txs}</Text>
        </TextWrapper>
        <TextWrapper>
          <Text>Contract Address</Text>
          <Text>{input}</Text>
        </TextWrapper>
        <TextWrapper>
          <Text>Holders</Text>
          <Text>{alldata.holders}</Text>
        </TextWrapper>
      </Flex>
    </TokenInfoContainer>
  )
}
