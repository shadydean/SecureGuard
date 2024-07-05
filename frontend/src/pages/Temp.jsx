import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom'
import sgLogo from '../assets/sgLogo.jpg';
import Login from '../components/Login';

const Counter = ({count,handleClick}) => {
  
  return (
    <>
      <h1>Count: {count}</h1>
      <button onClick={handleClick}>+1</button>

    </>
  )
};

const Temp = () => {
  const [count,setCount] = useState(0)
  function handleClick(){
    setCount(count => count + 1);
  }
  return (
    <>
      Hello
      <Counter count={count} handleClick={handleClick} />
    </>
  )
};

export default Temp;
