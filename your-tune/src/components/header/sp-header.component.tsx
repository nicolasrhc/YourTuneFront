import { Component, ReactNode } from "react";
import { ReactCookieProps, withCookies } from "react-cookie";
import logo_blanco from "../../img/logo-blanco.png"; //1280x860
import { Link, RouteChildrenProps } from "react-router-dom";
import { SPSearchInput } from "../search-input/search-input.component";
import { PruebaAPI, SPArtist } from "../../api/api";
import { Undefinable } from "../../utils/undefinable";
import logo_spotify from "../../img/logo_login.jpeg"; //1280x860

export interface FormBuscar {
    idArtist: Undefinable<string>;
}

export interface FormBuscarValidated extends FormBuscar {
    idArtist: string;
}

export type SPHeaderProps = ReactCookieProps & RouteChildrenProps;

export class _SPHeader extends Component<SPHeaderProps> {

    constructor (props: SPHeaderProps) {
        super (props);

        this.logout = this.logout.bind(this);
        this.goToHome = this.goToHome.bind(this);
        this.handleChangeArtista = this.handleChangeArtista.bind(this);
    }

    logout(): void {
        this.props.cookies?.remove("wantLog", {
            path: "/"
        });
        this.props.cookies?.remove("token", {
            path: "/"
        });
    }

    goToHome(): void {
        this.props.history.push("/dashboard/home");
    }

    getArtistLabel(artista: SPArtist): ReactNode {
        const image = artista.images.length > 0 ? artista.images[0].url : logo_spotify;
        return (
            <div>
                <img
                    className="mt-3"
                    height={40}
                    width={40}
                    src={image}
                    alt={artista.name}
                    style={{ borderRadius: "50%"}}
                />
                <span className="pt-1" style={{marginLeft: "10px"}}>
                    {artista.name}
                </span>
            </div>
        )
    };

    async obtenerArtistas (name: string): Promise<Undefinable<SPArtist[]>> {
        try {
            const response = await new PruebaAPI().obtenerArtistasBuscador(name)
            return response?.data;
        } catch (e) {
            console.log(e);
        }
    }

    handleChangeArtista (event: any): void {
        this.props.history.push("/dashboard/artist/" + event.target.value);
    }

    render(): ReactNode {
        return (
            <nav>
                <div className="header d-flex">
                    <img src={logo_blanco} className="img-logo-blanco-header" alt={"Logo"}/>
                    <div className="titulo-header text-decoration-underline" onClick={this.goToHome}>YourTune</div>
                    <Link to="/dashboard/daily-song" className="link-header">DailySong</Link>
                    <Link to="/dashboard/playlists" className="link-header">Playlists</Link>
                    <Link to="/dashboard/communities" className="link-header">Comunidades</Link>
                    <SPSearchInput<FormBuscar, SPArtist>
                        name="idArtist"
                        onChange={this.handleChangeArtista}
                        onSearch={this.obtenerArtistas}
                        onSetLabel={this.getArtistLabel}
                        valueKey="id"
                        style={{paddingTop: "15px", marginLeft: "50px"}}
                        value={undefined}
                    />
                    <Link to="/login" className="boton-header" onClick={this.logout}>Logout</Link>
                </div>
            </nav>
        )
    }
}

export const SPHeader = withCookies(_SPHeader);