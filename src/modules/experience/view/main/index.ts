import styled from "styled-components";

export const Wrapper = styled.div`
  /* margin: 0 auto;
  width: 400px; */
`;

export const NavigationHeader = styled.div`
  /* padding: 35px 24px 10px 24px;

  font-weight: 600;
  color: #fdfcfb; */
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  margin: 0 0 2px 0;
  padding: 0 24px;
  height: 56px;

  background: #1b1d19;
  color: #fdfcfb;

  cursor: pointer;

  &:hover,
  &:active {
    background: #272825;
  }
`;

export const AddLink = styled(MenuItem)`
  color: #898984;
`;
