
import './App.css'
import { items } from '../data';
import React, { useState } from 'react';
import HomeScreen from './homescreen/HomeScreen';

const App = () => {
  const uniqueProductNames = Array.from(new Set(items.map(product => product["Product Name"])));
  console.log(uniqueProductNames)
  return (
    <HomeScreen items={uniqueProductNames}/>
  );
};

export default App;

