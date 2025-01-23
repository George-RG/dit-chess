import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BottomNavigation, BottomNavigationAction} from '@mui/material'
import Header from './Header'


function Arena() {

  // const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // const handleResize = () => {
  //   setScreenWidth(window.innerWidth);
  // };

  // // Add event listener for resize on mount and clean up on unmount
  // useEffect(() => {
  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);


  // // Logic to determine which screen to show
  // const renderContent = () => {
  //   // Phone Version
  //   if (screenWidth < 768) {
  //     return <div>
  //       <Header />
  //       <>Div</>
  //       Mobile Screen</div>;
  //   } else {
  //     // Desktop Version
  //     return <div>
  //       <Header />
  //       This is an arena Jerw egw
  //       </div>;
  //   }
  // };

  // return <div>{renderContent()}</div>;

  return (<Box/>);
}

export default Arena;
