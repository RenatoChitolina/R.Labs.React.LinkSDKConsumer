import axios from 'axios';
import { useEffect, useState } from 'react'
import { ETHTokenType, Link, ProviderPreference } from '@imtbl/imx-sdk'

function App() {
  const [link, setLink] = useState<Link>();

  // NONE forces Link to open the wallet selection list.
  const setup = async () => {
    link?.setup({ providerPreference: ProviderPreference.NONE });
  }

  // The fixed and flexible deposit components are conditionally rendered
  // depending on the amount of properties that the sdk sends.
  const depositProps: { [key in 'fixed' | 'flexible']: any} = {
    ['fixed']: {
      type: ETHTokenType.ETH,
      amount: '0.1',
    },
    ['flexible']: { 
      type: ETHTokenType.ETH,
    },
  }
  const deposit = (variation: 'fixed' | 'flexible') => {
    link?.deposit(depositProps[variation]);
  }

  const buy = () => window.alert(`Although the "buy" component is still exposed as a route in Link, it's not being called by the SDK anymore.`);
  
  const buyV2 = async () => {
    const response = await axios.get('https://api.sandbox.x.immutable.com/v1/orders?page_size=1&order_by=buy_quantity&direction=asc&status=active&buy_token_type=ETH');
    
    const { result } = response.data;
    
    const cheapestAsset = result[0];

    console.log(JSON.stringify(cheapestAsset));

    link?.buy({
      orderIds: [cheapestAsset.order_id]
    });
  }

  // The inETH and flexible sell components are conditionally rendered
  // depending if the currency or the amount are passed by the sdk.
  const asset = { 
    tokenId: '4123073821', // TODO: Change
    tokenAddress: '0xfa5539fbed27887eebb2515672d80412d1a3ada3', // TODO: Change
  }
  const sellProps: { [key in 'inETH' | 'flexible']: any} = {
    ['inETH']: {
      ...asset,
      amount: '0.001',
    },
    ['flexible']: {
      ...asset,
      currencyAddress: '0x190b646c385023e707765fda54e8deef33c3a66a',
      amount: '0.001',
    },
  }
  const sell = (variation: 'inETH' | 'flexible') => {
    link?.sell(sellProps[variation]);
  }

  const transfer = () => window.alert(`Although the "transfer" component is still exposed as a route in Link, it's not being called by the SDK anymore.`);
  
  const transferV2 = async () => {
    link?.transfer([{
      type: ETHTokenType.ETH,
      amount: '0.01',
      toAddress: '0x421e0eBEf9f1DdeaaB900b2eD03A5Bb59daD70c7',
    }]);
  }

  useEffect(() => setLink(new Link('http://localhost:3002', {})), [])

  return (
    <div className="App">
      {link && 
        <div>
          <button onClick={setup}>Setup</button>
          <br />
          <br />
          <button onClick={() => deposit('fixed')}>Fixed Deposit</button>
          &nbsp;
          <button onClick={() => deposit('flexible')}>Flexibe Deposit</button>
          <br />
          <br />
          <button onClick={buy}>Buy</button>
          &nbsp;
          <button onClick={buyV2}>Buy v2</button>
          <br />
          <br />
          <button onClick={() => sell('inETH')}>inETH Sell</button>
          &nbsp;
          <button onClick={() => sell('flexible')}>Flexible Sell</button>
          <br />
          <br />
          <button onClick={transfer}>Transfer</button>
          &nbsp;
          <button onClick={transferV2}>Transfer v2</button>
        </div>
      }  
    </div>
  )
}

export default App
