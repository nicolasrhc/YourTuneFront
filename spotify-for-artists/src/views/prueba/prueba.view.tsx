import { Component, Fragment, ReactNode } from "react";
import { RouteChildrenProps } from "react-router-dom";
import { PruebaAPI, SPAlbum, SPArtist } from "../../api/prueba";
import { SPButton } from "../../components/button/sp-button.component";
import { Undefinable } from "../../utils/undefinable";
import { ReactCookieProps, withCookies } from "react-cookie";

export type PruebaViewProps = RouteChildrenProps & ReactCookieProps;
export interface PruebaViewState {
    datos: Undefinable<SPAlbum[]>;
    artist: Undefinable<SPArtist>;
}

export class _PruebaView extends Component<PruebaViewProps, PruebaViewState> {

    readonly state: PruebaViewState = {
        datos: undefined,
        artist: undefined,
    }

    constructor (props: PruebaViewProps) {
        super (props);

        this.obtenerDatos = this.obtenerDatos.bind(this);
        this.obtenerDatosArtist = this.obtenerDatosArtist.bind(this);
    }

    async componentDidMount(): Promise<void> {
        this.setToken();
    }

    setToken (): void {
        const spotifyCode = this.props.location.hash.split("=")[1].split("&")[0];
        this.props.cookies?.set("token", spotifyCode);
    }

    async obtenerDatos (): Promise<void> {
        try {
            const response = await new PruebaAPI().obtenerAlbumsYgritte()
            this.setState({
                datos: response?.data.body.items,
                artist: undefined,
            });
        } catch (e) {
            console.log(e)
        }
    }

    async obtenerDatosArtist (): Promise<void> {
        try {
            const response = await new PruebaAPI().obtenerArtistaYgritte()
            this.setState({
                datos: undefined,
                artist: response?.data.body,
            });
        } catch (e) {
            console.log(e);
        }
    }

    render (): ReactNode {
        return (
            <Fragment>
                <SPButton
                    onClick={this.obtenerDatos}
                >
                    Obtener datos
                </SPButton>
                <SPButton
                    onClick={this.obtenerDatosArtist}
                >
                    Obtener artista
                </SPButton>
                <div>
                {
                    this.state.datos?.map(dato => {
                        return (
                            <div key={dato.id}>
                                <div>Titulo: {dato.name} id: {dato.id}</div>
                                <img src={dato.images[0].url} height={dato.images[0].heigth} width={dato.images[0].width}/>
                            </div>
                        )
                    })
                }
                {
                    this.state.artist && (
                        <div>Nombre: {this.state.artist.name} seguidores: {this.state.artist.followers.total}</div>
                    )
                }
                </div>
            </Fragment>
        )
    }
}

export const PruebaView = withCookies(_PruebaView);