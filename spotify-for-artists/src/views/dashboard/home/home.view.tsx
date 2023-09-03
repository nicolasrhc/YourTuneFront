import { Component, Fragment, ReactNode } from "react";
import { ReactCookieProps, withCookies } from "react-cookie";
import { PruebaAPI, SPTrack } from "../../../api/api";
import { Undefinable } from "../../../utils/undefinable";
import { Table } from "antd";
import { RouteChildrenProps } from "react-router-dom";
import { SinCancionView } from "./sinCancion.view";
import { ConCancionView } from "./conCancion.view";
import { DashboardHeaderView } from "../header/dashboar-header.view";

export interface SPTrackPlaycount extends SPTrack {
    playcount: Undefinable<number>;
    albumName: Undefinable<string>;
    key: Undefinable<string>;
}

export interface SPTrackArtista extends SPTrack {
    artistaName: Undefinable<string>;
    albumName: Undefinable<string>;
    key: Undefinable<string>;
}

export interface SPTrackArtistaGrid extends SPTrack {
    artistaName: Undefinable<string>;
    albumName: Undefinable<string>;
    key: Undefinable<string>;
    index: number;
}

export type DashboardHomeViewProps = RouteChildrenProps & ReactCookieProps;

export interface DashboardHomeViewState {
    topCanciones: Undefinable<SPTrackArtistaGrid[]>;
    loadingTop: boolean;
    tieneDailySong: Undefinable<boolean>;
}

export class _DashboardHomeView extends Component<DashboardHomeViewProps, DashboardHomeViewState> {
    readonly state: DashboardHomeViewState = {
        topCanciones: undefined,
        loadingTop: false,
        tieneDailySong: false,
    }

    readonly columns = [
        {
            title: "#",
            dataIndex: "index",
            key: "index",
        },
        {
            title: "Canción",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Artista",
            dataIndex: "artistaName",
            key: "artistaName",
        },
        {
            title: "Album",
            dataIndex: "albumName",
            key: "playcount",
        },
    ];
    
    async componentDidMount(): Promise<void> {
        await this.getUserTopTracks();
        await this.obtenerTieneDailySong();
    }

    setTopLoading (loadingTop: boolean): void {
        this.setState({ loadingTop });
    }

    async obtenerTieneDailySong(): Promise<void> {
        try {
            const tieneDailySong = (await new PruebaAPI().usuarioTieneDailySong())?.data;

            this.setState({ tieneDailySong });
        } catch(error) {
            console.error(error);
        }
    }

    async getUserTopTracks(): Promise<void> {
        this.setTopLoading(true);
        const artistData = await new PruebaAPI().obtenerUserTopCanciones();
        const canciones: SPTrack[] = artistData?.data.body.items;

        const cancionesCount: SPTrackArtistaGrid[] = []
        canciones.forEach((cancion, index) => {
            const newCancion: SPTrackArtistaGrid = {
                ...cancion,
                albumName: cancion.album.name,
                artistaName: cancion.artists[0].name,
                key: cancion.id,
                index: index + 1,
            }
            cancionesCount.push(newCancion)
        });
        this.setState({topCanciones: cancionesCount, loadingTop: false})
        this.setTopLoading(false);
    }
    
    render (): ReactNode {
        return (
            <Fragment>
                <DashboardHeaderView />
                <div>
                    <div className="row m-0">
                        <div className="col-9"></div>
                        <div className="col-3"><div className="ml-2">Canción diaria</div></div>
                    </div>
                    <div className="row m-0">
                        <div className="col-9"></div>
                        <div className="col-3 cancion-diaria">
                            {
                                this.state.tieneDailySong
                                ? <ConCancionView />
                                : <SinCancionView
                                    history={this.props.history}
                                    location={this.props.location}
                                    match={this.props.match}
                                />
                            }
                        </div>
                    </div>
                    <div>Top Canciones</div>
                    <Table
                        dataSource={this.state.topCanciones?.slice(0, 10)}
                        columns={this.columns}
                        pagination={false}
                        loading={this.state.loadingTop}
                        scroll={{ y: "50vh" }}
                    />
                </div>
            </Fragment>
        )
    }
}

export const DashboardHomeView = withCookies(_DashboardHomeView);