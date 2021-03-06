import styled from 'styled-components'

export const Cards = styled.div`
  margin-bottom: 48px;
  ${({ theme }) => theme.mediaQueries.md} {
    display: grid;
    grid-gap: 24px;
    grid-template-columns:  repeat(3, 1fr);
    align-items: stretch;
    justify-content: stretch;
  }
`

export const LeftTopCard = styled.div`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    width: auto;
    grid-column: 1;
    grid-row: 1;
  }
`

export const RightTopCard = styled.div`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    width: auto;
    grid-column: 2;
    grid-row: 1;
  }
`

export const MiddleCard = styled.div`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    width: auto;
    grid-column: 3;
    grid-row: 1;
  }
`
