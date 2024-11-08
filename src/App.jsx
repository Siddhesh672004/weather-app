import React from 'react'
import Weather from './components/Weather'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  return (
    <>
      <div className='app'>
        <Weather />
      </div>
    </>
  )
}

export default App