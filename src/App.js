import { useEffect, useState } from 'react';
import './App.css';
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from "@clerk/clerk-react";

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + '/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
    // ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + '/transaction';
    // console.log(url);
    const price = name.split(' ')[0];
    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime
      })
    }).then(response => {
      response.json().then(json => {
        setName('');
        setDescription('');
        setDatetime('');
        console.log('result', json);
      })
    })
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }
  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];
  return (
    <>
      <SignedOut>
        <SignInButton>
          <input className={'inputButton'} type="button" value={'Log in'} />
        </SignInButton>
      </SignedOut>

   {/* The children of the SignedIn component are rendered only when the user is signed in. In this case, the app will render the SignOutButton */}
      <SignedIn>
        <main>
          <h1>Rs. {balance}<span>{fraction}</span></h1>
          <form onSubmit={addNewTransaction}>
            <div className='basic'>
              <input type="text"
                value={name}
                onChange={ev => setName(ev.target.value)}
                placeholder={'+200 new samsung tv'} />
              <input type="datetime-local"
                value={datetime}
                onChange={ev => setDatetime(ev.target.value)} />
            </div>
            <div className='description'>
              <input type="text"
                value={description}
                onChange={ev => setDescription(ev.target.value)}
                placeholder={'description'} />
            </div>
            <button type='submit'>Add new transaction</button>
          </form>
          <div className="transactions">
            {transactions.length > 0 && transactions.map(transaction => (
              <div className="transaction">
                <div className="left">
                  <div className="name">{transaction.name}</div>
                  <div className="description">{transaction.description}</div>
                </div>
                <div className="right">
                  <div className={"price " + (transaction.price < 0 ? 'red' : 'green')}>{transaction.price}</div>
                  <div className="datetime">{transaction.datetime}</div>
                </div>
              </div>
            ))}
          </div>
        </main>
        <SignOutButton>
          <input className={'inputButton'} type="button" value={'Log out'} />
        </SignOutButton>
      </SignedIn>
    </>
  );
}

export default App;
