import React from "react";
import App from "../../App";

const GaleriaHome = (props, busqueda) => {
    console.log(props)
    console.log(busqueda)
    if (props.results){
        props = props.results
    } 

    return(
        <div className="galeriaHome">
            <div>{Array.from(props).map((elemento, index) =>
                <div
                    key={elemento.id}
                    id={elemento.id}
                >
                    <img
                        src={elemento.urls.small_s3}
                        alt={elemento.alt_description}
                    />
                    {/*Si hay ubicación, la muestra*/}
                    {(elemento.user.location ?
                        (<span>{elemento.user.location}</span>)
                        : null)}
                </div>
            )}
            </div>
        </div>
    )

}

export { GaleriaHome };