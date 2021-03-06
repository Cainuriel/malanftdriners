import React from "react";
import { useState, useEffect, useCallback } from "react";
import Swal from 'sweetalert2';
import { ethers } from 'ethers';
import NFT from './artifacts/contracts/BNBCollection.sol/BNBCollection.json';
import getToken from './helpers/getToken';

const FetchCard = (props) => { 

    const [object, setObject] = useState({
        name: 'name',
        description: 'description',
        rarity: 'rarity',
        filetype: 'filetype',
        img: 'image',
        video: 'video',
      });
      const nftContract = "0xEC2b1F41E90590cfc44c090DFdeed9DCb55eE000"; // proyecto bnbmarketplace
      // funcion para capturar la URI de un NFT
      async function fetchToken(idToken)  {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(nftContract, NFT.abi, signer);

          try {

            const tokenUri = await contract.tokenURI(idToken);
             updateToken(`https://ipfs.infura.io/ipfs/${tokenUri}?clear`);

          } catch (err) {
            let mensajeError = err.message;
            Swal.fire({
              title: 'Fallo acceso a metadata',
              text: `${mensajeError}`,
              icon: 'error',
              confirmButtonText: 'Cerrar'
            })
            console.log("Error: ", err)
          }
          
   
  }

    const updateToken = async (url) => {
       await getToken(url) 
            .then(
                (newToken) => {
                    setObject(
                        {
                          name: newToken.properties.name.description,
                          description: newToken.properties.description.description,
                          rarity: newToken.properties.rarity.description,
                          filetype: newToken.properties.filetype.description,
                          img: newToken.properties.image.description,
                          video: newToken.properties.video.description,
                        });
                ;}
            )
    }

    useEffect(() => {
        fetchToken(props.idToken);
    }, []);

    return (

        <div key={object.name} className="col-lg-6 text-center text-lg-start py-2">
                  <small>{parseInt(props.idToken._hex, 16)}</small>
            <div className="card mb-3" style={{maxWidth: "750px"}}>
                <div className="row g-0">
                    <div className="col-md-8">
                    {object.filetype === "Imagen" ?
                    <img src={`https://ipfs.infura.io/ipfs/${object.img}`} className="img-fluid rounded-start"/>
                    : 
                    <video width="400" autoPlay loop muted>
                      <source src={`https://ipfs.infura.io/ipfs/${object.video}`} type="video/mp4"/>
                    </video>
                    }
                    </div>
                    <div className="col-md-4">
                        <div className="card-body">
                        <h5 className="card-title">{object.name}</h5>
                        <p className="card-text">{object.description}</p>
                        <p className="card-text"><strong>Rareza: </strong><small className="text-muted">{object.rarity}</small></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FetchCard