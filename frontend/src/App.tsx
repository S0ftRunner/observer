import { Box, styled } from "@mui/material"
import { Outlet } from "react-router"
import { Background } from "./components"
import { Header } from "./blocks"

function App () {
  const MainWrapper = styled(Box)`
    position: relative;
    width: 100vw;

    overflow-x: hidden;
    overflow-y: scroll;
  `
  return (
    <MainWrapper>
      <Header />
      <Background />
      <Outlet />
    </MainWrapper>
  )
}

export default App;