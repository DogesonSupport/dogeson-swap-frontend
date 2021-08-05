import React, { useState,useEffect,createContext } from 'react'
import styled from 'styled-components'

import { Card, Flex,Text ,Button} from '@pancakeswap-libs/uikit'

import { ReactComponent as TwitterIcon } from 'assets/svg/icon/TwitterIcon.svg'
import { ReactComponent as SocialIcon2 } from 'assets/svg/icon/SocialIcon2.svg'
import { ReactComponent as TelegramIcon } from 'assets/svg/icon/TelegramIcon.svg'

import CopyHelper from 'components/AccountDetails/Copy'
import axios from 'axios';
// import { GetInputData } from '../index';
import { TokenDetailProps } from './types'


export interface ContractPanelProps {
  value: any
}

const ContractPanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 28px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;   
  }
`

const IconWrapper = styled.div<{ size?: number }>`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  margin-left: 36px;
  height: ${({ size }) => (size ? `${size}px` : '32px')};
  width: ${({ size }) => (size ? `${size}px` : '32px')};
  & > img, span {
    height: ${({ size }) => (size ? `${size}px` : '32px')};
    width: ${({ size }) => (size ? `${size}px` : '32px')};
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    align-items: flex-end;
  }
`

const ContractCard = styled(Text)`
  padding: 0 4px;
  height: 40px;
  text-overflow: ellipsis;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 16px;
  display: flex;
  align-items: center;
  margin: 12px 0;
  & input {
    background: transparent;
    border: none;
    flex: 1;
    overflow: hidden;
    box-shadow: none;
    outline: none;
    color: #F7931A;
    font-size: 16px;
    &::placeholder {
      color: red
    }
  }
  & button:last-child {
    background: #8B2A9B;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    & input {
      min-width: 360px;
    }
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin: 0;
  }
`

const SocialIconsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  & svg {
    margin: 0 11px;
  }
`
// {token} : ContractPanelProps) 
export default function ContractPanel({value}: ContractPanelProps){

  const [ addressSearch, setAddressSearch ] = useState('');
  localStorage.setItem('InputAddress', addressSearch);

  // console.log("addressSearch",addressSearch)
     const handlerChange=(e)=>{
      setAddressSearch(e.target.value)
     }

     const InputSubmit=(e)=>{
       e.preventDefault();
      //  console.log("click");
     
     }
    // useEffect(() => {
    //   const getalldata=()=>{
    //     axios.get(`http://192.168.18.65:8080/v1.0/dogeson/info/contract/${addressSearch}`).then((response)=>{
    //       console.log("get api",response)
    //     })
    // }

    //    getalldata();
    // },[addressSearch]);
    
  return (
    <ContractPanelWrapper>
      <ContractCard>
        <CopyHelper toCopy={value ? value.contractAddress : addressSearch}>
          &nbsp;
        </CopyHelper>
        <input placeholder='' value={addressSearch} onChange={handlerChange} />
        <Button size='sm' onClick={InputSubmit}>Submit</Button>
      </ContractCard>
      <SocialIconsWrapper>
        <TwitterIcon />
        <SocialIcon2 />
        <TelegramIcon />
      </SocialIconsWrapper>
    </ContractPanelWrapper>

  )
}



