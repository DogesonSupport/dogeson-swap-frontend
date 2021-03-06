import React, { useState, useCallback } from 'react'
import { Currency, Pair } from '@pancakeswap-libs/sdk'
import { Button, ChevronDownIcon, Text } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { darken } from 'polished'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween } from '../Row'
import { Input as NumericalInput } from '../NumericalInput'
import { useActiveWeb3React } from '../../hooks'
import TranslatedText from "../TranslatedText"
import { TranslateString } from '../../utils/translateTextHelpers'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 8px 6px;

  & input {
    text-align: right;
    color: white;
    font-size: 22px;
    letter-spacing: -0.04em;
    font-weight: normal;
    &::placeholder {
      color: white;
    }
  }
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  background-color: #8b2a9b;
  color: ${({ selected, theme }) => (selected ? theme.colors.text : '#FFFFFF')};
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 2px 4px;
  margin-right: 4px;

  :focus,
  :hover {
    opacity: 0.6;
  }

  & > span {
    & > div {
      font-size: 12px;
      letter-spacing: -0.02em;
      color: white;
      font-weight: 700;
    }
    & > svg > path {
      fill: white;
    }
  }
`

// const LabelRow = styled.div`
//   display: flex;
//   flex-flow: row nowrap;
//   align-items: center;
//   color: ${({ theme }) => theme.colors.text};
//   font-size: 0.75rem;
//   line-height: 1rem;
//   padding: 0.75rem 1rem 0 1rem;
//   span:hover {
//     cursor: pointer;
//     color: ${({ theme }) => darken(0.2, theme.colors.textSubtle)};
//   }
// `

const MaxButtonWrapper = styled.div`
  & button {
    background-color: #8B2A9B;
    color: white;
    margin-left: 4px;
    padding: 8px 6px;
    font-size: 14px;
    &:hover {
      background-color: #8B2A9B !important;
      opacity: 0.6;
    }
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.colors.background};
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.4);
`

// const USDAmount = styled.p`
//   color: white;
//   text-align: right;
//   padding: 0 16px 12px 0;
//   font-size: 12px;
//   font-weight: bold;
// `

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = TranslateString(132, 'Input'),
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases
}: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        {/* {!hideInput && (
          <LabelRow>
            <RowBetween>
              <Text fontSize="14px">{label}</Text>
              {account && (
                <Text onClick={onMax} fontSize="14px" style={{ display: 'inline', cursor: 'pointer' }}>
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? `Balance: ${  selectedCurrencyBalance?.toSignificant(6)}`
                    : ' -'}
                </Text>
              )}
            </RowBetween>
          </LabelRow>
        )} */}
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            <Aligner>
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={14} margin />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="14px" style={{ marginRight: '4px' }} />
              ) : null}
              {pair ? (
                <Text>
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <Text>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? `${currency.symbol.slice(0, 4) 
                      }...${ 
                      currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)}`
                    : currency?.symbol) || <TranslatedText translationId={82}>Select a currency</TranslatedText>}
                </Text>
              )}
              {!disableCurrencySelect && <ChevronDownIcon />}
            </Aligner>
          </CurrencySelect>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={val => {
                  onUserInput(val)
                }}
              />
              {account && currency && showMaxButton && label !== 'To' && (
                <MaxButtonWrapper>
                  <Button onClick={onMax} size="sm" variant="text">
                    MAX
                  </Button>
                </MaxButtonWrapper>
              )}
            </>
          )}
        </InputRow>
        {/* <USDAmount>~$ 2,055.02</USDAmount> */}
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  )
}
