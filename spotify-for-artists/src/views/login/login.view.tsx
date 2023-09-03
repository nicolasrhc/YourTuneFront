import { Component, ReactNode } from "react";
import { RouteChildrenProps } from "react-router-dom";
import { SPButton } from "../../components/button/sp-button.component";
import logo_spotify from "../../img/logo_login.jpeg"; //1280x860
import { ReactCookieProps, withCookies } from "react-cookie";

var client_id = '7705366dc3964086bc21504f1be0fd2e'; // Your client id
var redirect_uri = 'http://localhost:3000/dashboard/home'; // Your redirect uri
const scopes = [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state",
    "playlist-modify-public",
    "playlist-modify-private"
];
const authEndpoint = "https://accounts.spotify.com/authorize";
const loginUrl = `${authEndpoint}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;

export type LoginViewProps = RouteChildrenProps & ReactCookieProps;

export class _LoginView extends Component<LoginViewProps> {

    constructor (props: RouteChildrenProps) {
        super(props);

        this.goToSpotify = this.goToSpotify.bind(this);
    }

    goToSpotify(): void {
        this.props.cookies?.set("wantLog", true, {});
        window.location.replace(loginUrl);
    }

    render(): ReactNode {
        return (
            <div className="contenedor-login">
                <img className={"img-logo-login"} src={logo_spotify} alt={"Logo Spotify"}/>
                <div className="form-login">
                    <label className="label-buscador mb-3">Bienvenido a YourTune!</label>
                    <div>
                        <SPButton
                            onClick={this.goToSpotify}
                            type={"primary"}
                        >
                            Conectar con Spotify
                        </SPButton>
                    </div>
                </div>
            </div>
        )
    }
}

export const LoginView = withCookies(_LoginView);