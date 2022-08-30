import styled from "styled-components";

type BarChartPropsT = {
  prevCount: number,
  lastCount: number,
}
export default function BarChart({ prevCount, lastCount }: BarChartPropsT) {
  const unitHeight = 100.0 / Math.max(prevCount, lastCount);

  return (
    <Container>
      <MainContainer>
        <BarChartContainer>
          <Number color="#ff47ab">
            <Title>Number of entries in the last 7 days</Title>
            {lastCount}
          </Number>
          <MakeBar height={lastCount * unitHeight} colors={["#ff47ab", "#e0064e"]} />
        </BarChartContainer>

        <BarChartContainer>
          <Number color="#ffd847">
            <Title>Number of entries the week before</Title>
            {prevCount}
          </Number>
          <MakeBar height={prevCount * unitHeight} colors={["#ffd847", "#e0a106"]} />
        </BarChartContainer>
      </MainContainer>
    </Container>
  );
}

const Container = styled.div`
  margin: 0px auto;
  max-width: 800px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
`;

const MainContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const BarChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

const Number = styled.span`
  font-size: 1.5rem;
  text-align: center;
  color: ${(props) => props.color};
`;

const Title = styled.div`
  font-size: 1rem;
  text-align: center;
  color: ${(props) => props.color};
`;

const MakeBar = styled.div<{height: number, colors: string[]}>`
  height: ${(props) => props.height > 0 ? `calc((100% - 70px) * ${props.height/100})`: '3px'};
  background-image: linear-gradient(
    to bottom,
    ${(props) => props.colors[0]},
    ${(props) => props.colors[1]}
  );

  margin-top: 10px;
  width: 56px;
  &:hover {
    opacity: 0.8;
  }
  @media (max-width: 420px) {
    width: 34px;
  }
`;
