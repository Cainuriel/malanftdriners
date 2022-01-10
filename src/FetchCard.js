import React from "react";
import { useState, useEffect, useCallback } from "react";
import Swal from 'sweetalert2';
import { ethers } from 'ethers';
import NFT from './artifacts/contracts/FishervsPirate.sol/FishervsPirate.json';
import getToken from './helpers/getToken';

const FetchCard = (props) => { // @props: La id del NFT

    const [object, setObject] = useState({
        name: 'name',
        description: 'description',
        image: 'image',
        video: 'video',
        rarity: 'rarity',
        number: 'number',
        total: 'total',
      });
      // 0x4F1353Efc9EC1e5976327532fED8E8D89B1359Ea FishervsPirate test 2
      const nftContract = "0x7C6DeAdde7ABc337F7E5272d1CdF1ce04E0A3603"; // FishervsPirate hardhat deploy
      // funcion para capturar la URI de un NFT
      async function fetchToken(idToken)  {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(nftContract, NFT.abi, signer);

        console.log('idtoken ', idToken._hex);

          try {

            const tokenUri = await contract.tokenURI(idToken);
             updateToken(tokenUri);

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
      // funcion que crea el objeto del token
    const updateToken = async (url) => {
       await getToken(url) // funcion que hace el fetch
            .then(
                (newToken) => {
                  console.log('este es el metadata del token', newToken);
                    setObject(
                        {
                            name: newToken.name,
                            description: newToken.description,
                            image: newToken.image,
                            video: newToken.video,
                            rarity: newToken.attributes[0].value,
                            number: newToken.attributes[1].value,
                            total: newToken.attributes[1].max_value,

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
                    {object.image !== "image" &&
                    <img src={object.image} className="img-fluid rounded-start"/>
                    }
                    {object.video !== "video" &&
                 
                    <video width="400" autoPlay loop muted>
                      <source src={object.video} type="video/mp4"/>
                    </video>
                    }
                    </div>
                    <div className="col-md-4">
                        <div className="card-body">
                        <h5 className="card-title">{object.name}</h5>
                        <p className="card-text">{object.description}</p>
                        <p className="card-text"><strong>Rareza: </strong><small className="text-muted">{object.rarity}</small></p>
                        <p className="card-text"><strong>Serie: </strong><small className="text-muted">{object.number} of {object.total}</small></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FetchCard