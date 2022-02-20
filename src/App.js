import React from "react";
import { useEffect, useState} from 'react';
import './App.css';
import Swal from 'sweetalert2';
import VideoPlayer from "react-background-video-player";
import { ethers } from 'ethers';
import NFT from './artifacts/contracts/BNBCollection.sol/BNBCollection.json';
import FetchCard from './FetchCard';



function App() {
 
  const BINANCETESTNET = 'bnbt';
  const nftContract = "0xEC2b1F41E90590cfc44c090DFdeed9DCb55eE000"; // bnbmarketplace
  const [balance, setBalance] = useState([]);
  const [network, setNetwork] = useState('no-net');
  const BNBPRICE ='300000000000000000';

 // parallax effect
  const [offSetY, setOffSetY] = useState(0);
  const handleScroll = () => setOffSetY(window.scrollY);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [])

  // se comprueba si se dispone de metamask, las funcion de chequeo de la red y cambio de cuenta
  useEffect(function () {

    if (typeof window.ethereum !== 'undefined') {
    
    checkingNetwork();
    changeAccounts();
  
 
    } else {
            Swal.fire({
              title: "No tiene metamask instalado",
              text: "Cambie de navegador o puede instalárselo apretando al botón",
              showCancelButton: true,
              confirmButtonText: "Instalar",
              imageUrl: './img/metamask-transparent.png',
              imageAlt: "Instalar metamask",
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn', '_blank');  
              }})};
        
      },[]);

  // control de cambio de red
  useEffect(function () {

      // comprueba si se dispone la red adecuada.
      if(network !== BINANCETESTNET && network !== 'no-net' ){ 

          Swal.fire({
            title: '¡Atencion!',
            text: "Estas en la red "+network,
            showCancelButton: true,
            confirmButtonText: "Instalar o cambiar a la red Testnet BSC",
            imageUrl: 'https://cryptodaily.io/wp-content/uploads/2021/07/p-2.png',
            imageWidth: 300,
            
            imageAlt: 'Red Binance Smart Chain',
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              addNetwork();
            }
          })
        }
      
},[network]);

  // funcion que cambia o instala la red de pruebas de BSC
  async function addNetwork() {

    let networkData = [{
            chainId: "0x61",
            chainName: "BSCTESTNET",
            rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
            nativeCurrency: {
              name: "BINANCE COIN",
              symbol: "BNB",
              decimals: 18,
            },
            blockExplorerUrls: ["https://testnet.bscscan.com/"],
          },
        ];

      // agregar red o cambiar red
      return window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: networkData,
      });
  }

    // captura de la blockchain de la metamask
  async function checkingNetwork() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // capturamos la red
    const network = await provider.getNetwork();
    //console.log('network', network.name);
    setNetwork(network.name);
  }

  // funcion de conexion a la red.
  async function init() {  
            // captura la cuenta del usuario
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            let accountConnection = accounts[0];
            //console.log('esta conectado',accountConnection);
            let subint = accountConnection.substr(0,4);
            let subfinal = accountConnection.substr(-4,4);
            document.querySelector('#intro').innerHTML ='Conectado con la cuenta: ' + subint + '...' + subfinal;
            await checkingNFTs(accountConnection);
            let element = document.querySelector("#formBuy");
            element.classList.remove("d-none");
                
  }
     // comprobacion de NFTs
  async function checkingNFTs(account) { 

     const provider = await new ethers.providers.Web3Provider(window.ethereum);
     const signer = provider.getSigner();
     const contract = await new ethers.Contract(nftContract, NFT.abi, signer);

     try {
       const contractUserBalance = await contract.tokensOfOwner(account);
        //console.log('contract user balance', contractUserBalance);
          // comprobamos si el usuario tiene avatares.
          if(contractUserBalance.length > 0) {
            document.querySelector('#tokens').innerHTML ='Precio: 0.3 BNB';
            let newArray = contractUserBalance;
            setBalance(newArray);
            
              }    else {
                document.querySelector('#tokens').innerHTML ='Precio: 0.3 BNB';

              }

        } catch (err) {
          let mensajeError = err.message;
          if (err.message === 'call revert exception (method="tokensOfOwner(address)", errorArgs=null, errorName=null, errorSignature=null, reason=null, code=CALL_EXCEPTION, version=abi/5.5.0)') {
            mensajeError =  'No ha cambiado a la red adecuada. Cambie de red y vuelva a recargar la página.';
          } 
          
          Swal.fire({
            title: 'Ooops!',
            text: `${mensajeError}`,
            icon: 'error',
            confirmButtonText: 'Cerrar'
          })
          //console.log("Error: ", err)
        }

  }


    // funcion que detecta los cambios de cuenta
    async function changeAccounts() {
          
      if (typeof window.ethereum !== 'undefined') {

        window.ethereum.on("accountsChanged", async function () {

          await init();
          
        });

      }
    }
    // funcion que abre el faucet para pedir BNBs de prueba
    function faucet() {
      window.open('https://testnet.binance.org/faucet-smart', '_blank');  
    }

    async function buytokens() {
        
          const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(nftContract, NFT.abi, signer);
          
          try {
            const transaction = await contract.saleMintToken(account, {value: BNBPRICE});
            // event capture
            contract.on("TokenPurchase", (a, b, c, d) => {
              let amountBNB = ethers.utils.formatEther(c);
             // console.log(`Comprador: ${b} precio: ${amountBNB} idtoken: ${d}`);
              });

            Swal.fire({
              title: 'Procesando el pago',
              text: 'Espere. No actualice la página',
              showConfirmButton: false,
              imageUrl: 'https://thumbs.gfycat.com/ConventionalOblongFairybluebird-size_restricted.gif',
              imageWidth: 100,
              imageHeight: 100,
              imageAlt: 'Procesando el pago',
  
            });
            
            const Ok = await transaction.wait();
            //console.log(`hash: ${transaction.hash}`);

                  if(Ok) {
                    Swal.fire({
                    title:  `Se ha envíado un NFT a la cuenta ${account}`,
                    html: `<a href="https://testnet.bscscan.com/tx/${transaction.hash}" target="_blank" rel="noreferrer">Hash de la transacción</a>`,
                    icon: 'success',
                    confirmButtonText: 'Cerrar'
                  }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                      init();
                    } else if (result.isDenied) {
                      init();
                    }
                  })
          
              };
        
      
          }catch (err) {
            let mensajeError = err.message;
             
            if (err.data) {
  
              if (err.data.message === 'execution reverted: Sale must be active to buy Tokens') {
                mensajeError =  'La venta no está habilitada';
              }  else if(err.data.message === 'execution reverted: value sent needs to be atleast sale price'){
                mensajeError =  'Debe de pagar como mínimo el precio estipulado';
              } else  if(err.data.message === 'execution reverted: There are no tokens to buy'){
                mensajeError =  'Lo sentimos. Ya no hay mas NFTs a la venta. Informese en el canal de Telegram';
              } else {
                console.log('error: ',mensajeError);
              }
            }
  
            Swal.fire({
              title: 'Ooops!',
              text: `${mensajeError}`,
              icon: 'error',
              confirmButtonText: 'Cerrar'
            })
            console.log("Error: ", err)
          }
       
    }

  return (

<div className="frame container">
        <div className="main row align-items-center g-lg-5 py-5" style={{transform: `translateY(-${offSetY * 0.3}px)`}}>
          <div className="col-lg-4 text-center text-lg-start">
            <form className="p-4 p-md-5 border rounded-3 bg-light">
            <div className="form-floating mb-3">
            <h2 id="intro" className="text-muted">No conectado</h2>
            </div>
            <hr className="my-4"/>
            <h3 id="tokens" className="text-muted"></h3>
            </form>
          </div>
          <div className="col-lg-4 text-center text-lg-start">
            <button id="btn-firma"  onClick={() => init()} className="w-100 btn btn-lg btn-danger mb-4" type="button">Conectar Metamask</button>
            <button id="faucet"  onClick={() => faucet()} className="w-100 btn btn-lg btn-primary" type="button">Faucet de Binance</button>
            <button id="formBuy" onClick={() => buytokens()} className="w-100 btn btn-lg btn-success my-4 d-none" type="button">Comprar NFTs</button>
          </div>
        </div>
        <div className="row align-items-center g-lg-5"> 
            {
          balance && // si hay balance se imprimiran los NFTs.
              balance.map((idToken) => {
                
                return  <FetchCard idToken={idToken} />
              }) 
 
            }
        </div> 

    <VideoPlayer style={{transform: `translateY(${offSetY * 1}px)`}}
        className="Video"
        src={
          "./video.mp4"
        }
        autoPlay={true}
        muted={true}
        loop={true}
      />
</div>

  );
}

export default App;
