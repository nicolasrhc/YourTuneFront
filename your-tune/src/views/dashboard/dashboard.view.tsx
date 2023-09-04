import { Component, Fragment, ReactNode } from "react";
import { Route, RouteChildrenProps, Switch } from "react-router-dom";
import { SPHeader } from "../../components/header/sp-header.component";
import { DashboardHomeView } from "./home/home.view";
import { ReactCookieProps, withCookies } from "react-cookie";
import { DailySongView } from "../daily-song/daily-song.view";
import { PlaylistsView } from "../playlists/playlists.view";
import { ArtistaView } from "../artist/artist.view";
import { ComunidadesView } from "../communities/communities.view";
import { ComunidadesDetalleView } from "../communities/communitiesDetail.view";
import { BuscadorComunidadesView } from "../communities/buscador/buscador-comunidades.view";

export type DashboardViewProps = RouteChildrenProps & ReactCookieProps;

export class _DashboardView extends Component<DashboardViewProps> {
    async componentDidMount(): Promise<void> {
        this.setToken();
    }

    setToken (): void {
        if (!this.props.cookies?.get("token")) {
            const spotifyCode = this.props.location.hash.split("=")[1].split("&")[0];
            this.props.cookies?.set("token", spotifyCode, {
                path: "/",
                
            });
        }
    }

    render(): ReactNode {
        return (
            <Fragment>
                <SPHeader {...this.props}/>
                <Switch>
                    <Route path={"/dashboard/home"} component={DashboardHomeView}/>
                    <Route path={"/dashboard/daily-song"} component={DailySongView}/>
                    <Route path={"/dashboard/playlists"} component={PlaylistsView}/>
                    <Route path={"/dashboard/artist/:idArtista"} component={ArtistaView}/>
                    <Route path={"/dashboard/communities/search"} component={BuscadorComunidadesView}/>
                    <Route path={"/dashboard/communities/:idComunidad"} component={ComunidadesDetalleView}/>
                    <Route path={"/dashboard/communities"} component={ComunidadesView}/>
                </Switch>
            </Fragment>
        )
    }
}

export const DashboardView = withCookies(_DashboardView);