import React, { useState,useEffect } from 'react'
import styled from 'styled-components'
import { Text, Button } from '@pancakeswap-libs/uikit'
// eslint-disable-next-line import/no-unresolved
import { ReactComponent as TwitterIcon } from 'assets/svg/icon/TwitterIcon.svg'
// eslint-disable-next-line import/no-cycle
// eslint-disable-next-line import/no-unresolved
import { ReactComponent as SocialIcon2 } from 'assets/svg/icon/SocialIcon2.svg'
// eslint-disable-next-line import/no-unresolved
import { ReactComponent as TelegramIcon } from 'assets/svg/icon/TelegramIcon.svg'
// eslint-disable-next-line import/no-unresolved
import CopyHelper from 'components/AccountDetails/Copy'
// eslint-disable-next-line import/no-unresolved
import './dropdown.css'
import axios from 'axios'
import {Button as materialButton,Menu,MenuItem} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Web3 from 'web3';
import { useDispatch } from 'react-redux'
import { typeInput } from '../../../state/input/actions'


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
      min-width: 420px;
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
export default function ContractPanel({ value }: ContractPanelProps) {

  const [addressSearch, setAddressSearch] = useState('');
  const [show, setShow] = useState(true)
  // const [showDrop, setshowDrop] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDrop,setShowDrop]=useState(false);

  // eslint-disable-next-line no-console
  // console.log("result===============================>",result)  // => true
  const [data,setdata]=useState([])
  const dispatch = useDispatch();
  const handlerChange = (e: any) => {
    // console.log("e.target.value",e.target.value);
  
      try{
       
          axios.get(`https://api.sphynxswap.finance/search/${e.target.value}`)
            .then((response) => {
                // setalldata(response.data)
                // console.log("response",response.data);
                setdata(response.data);
                
            })
        }
  
      
      catch(err){
         // eslint-disable-next-line no-console
        // console.log(err);
        // alert("Invalid Address")
        console.log("errr",err.message);
        
        
      }
     
       
    const result = Web3.utils.isAddress(e.target.value)
    if (result) {
      setAddressSearch(e.target.value)
      setShow(false);
    }
    else {
      setAddressSearch(e.target.value)
      setShow(true);
    }
  }
  // const DropDownShow = () => {
  //   setshowDrop(true)
  // }
    

  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
    setShowDrop(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const submitFuntioncall=()=>{
    dispatch(typeInput({ input: addressSearch }))
  }
  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      submitFuntioncall();
    }
  }

  

  useEffect(() => {
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        // console.log("Enter key was pressed. Run your function.");
        // callMyFunction();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <>
      <ContractPanelWrapper>
        <ContractCard>
          <CopyHelper toCopy={value ? value.contractAddress : addressSearch}>
            &nbsp;
          </CopyHelper>
          <input placeholder='' value={addressSearch}  onKeyPress={handleKeyPress} onChange={handlerChange} />
          <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
      <ArrowDropDownIcon/>
      </Button>
        {showDrop ? <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >{data.length > 0 ?
       <span>
         {data?.map((item:any )=>{
          //  {console.log('d==>', item)}
          return <MenuItem onClick={()=> dispatch(typeInput({ input: item.address })) && setAnchorEl(null)}>{item.name}<br/>{item.symbol}<br/>{item.address}</MenuItem>
         })}
         
       </span> : 
        <MenuItem >no record</MenuItem>}
      </Menu>:""}
    </div>
        </ContractCard>
        <Button size='sm' onClick={submitFuntioncall} disabled={show} >Submit</Button>
        <SocialIconsWrapper>
          <TwitterIcon />
          <SocialIcon2 />
          <TelegramIcon />
        </SocialIconsWrapper>
      </ContractPanelWrapper>
    </>

  )
}



