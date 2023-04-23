import Image from 'next/image'
import { Inter } from 'next/font/google'
import React, { useState } from 'react'
import { Alchemy } from 'alchemy-sdk';

const inter = Inter({ subsets: ['latin'] })

type Owner = string;

type OwnersState = {
  owners: Owner[];
};



export default function Home() {
  const [address, setAddress] = useState('empty');
  const [fetchedOwners, setFetchedOwners] = useState(false);
  const [owners, setOwners] = useState<OwnersState>({ owners: [] });
  const { Alchemy, Network } = require("alchemy-sdk");

  const config = {
    apiKey: process.env.alchemyAPI,
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(config);

  const getList = async () => {
    // BAYC contract address
    //const address = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";

    // Get owners 
    const ownersList = await alchemy.nft.getOwnersForContract(address, false);
    setOwners(ownersList)
    console.log(ownersList.owners)

    setFetchedOwners(true);
  };

  const handleChange = (event: { target: { value: any; }; }) => {
    const value = event.target.value
    setAddress(value)
  }

  const exportToCsv = () => {
    const filename = 'Snapshot'
    const separator = ',';
    let csv = '';
    // Add rows to the CSV string
    owners.owners.forEach((value) => {
      const cell = value == null ? '' : value.toString();
      csv += cell + separator;
    });
  
    // Download the CSV file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (fetchedOwners) {
    return (
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
      >
        <div>
          Welcome to the Snapshot tool! This is available for the ETHEREUM chain only.
        </div>

        <div>
          Enter your contract address for the NFT project:
        </div>

        <input type='text' placeholder='0x..' onChange={handleChange} className='text-ellipsis overflow-hidden' style={{ color: 'black' }}></input>

        <div className='flex p-3'>
          <div className='pr-3'>
            <button className='rounded-full bg-blue-500 p-3 hover:bg-sky-700'
              onClick={() => getList()} style={{ color: 'white' }}>

              Get holders

            </button>
          </div>


          <div className='pr-3'>
            <button className='rounded-full bg-blue-500 p-3 hover:bg-sky-700'
              onClick={() => exportToCsv()} style={{ color: 'white' }}>

              Export List as .csv

            </button>
          </div>
        </div>

        <div>
          {owners.owners.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>

      </main>
    )
  }


  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div>
        Welcome to the Snapshot tool! This is available for the ETHEREUM chain only.
      </div>

      <div>
        Enter your contract address for the NFT project:
      </div>

      <input type='text' placeholder='0x..' onChange={handleChange} className='text-ellipsis overflow-hidden' style={{ color: 'black' }}></input>

      <div className='rounded-full'>
        <button className='rounded-full bg-blue-500 p-3 hover:bg-sky-700'
          onClick={() => getList()} style={{ color: 'white' }}>Get holders</button>
      </div>

    </main>
  )
}
