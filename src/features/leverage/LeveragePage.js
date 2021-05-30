import React, { useEffect } from 'react';
import LeverageList from './sections/LeverageList/LeverageList';

export default function LeveragePage(props) {

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  return (
    <>
      <LeverageList />
    </>
  );
}
