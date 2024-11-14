import React, { useEffect, useState } from 'react';
import './hometransfer.css';
import UserDetail from '../components/UserDetail';
import PaymentGuide from '../components/PaymentGuide';

const HomeTransfer = ({ handleModal }) => {
  const [countdown, setCountdown] = useState(null); // Initially null
  const [timerExpired, setTimerExpired] = useState(false);

  const handleDurationFetched = (duration) => {
    setCountdown(duration); // Set countdown once accountDuration is fetched
  };

  useEffect(() => {
    if (countdown === null) return; // Skip interval if countdown hasn't been set

    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(intervalId);
          setTimerExpired(true);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdown]);

  const formatTime = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (timerExpired) {
    return (
      <div className='transfer-error'>
        <h1>Error: Transaction timed out</h1>
        <p>❌</p>
      </div>
    );
  }

  return (
    <>
      <div className='hometransfer'>
        <UserDetail formatTime={formatTime} onDurationFetched={handleDurationFetched} />
        <PaymentGuide />
      </div>
      <div className="step-3">
        <button onClick={handleModal}>I have made this bank transfer</button>
      </div>
    </>
  );
};

export default HomeTransfer;
