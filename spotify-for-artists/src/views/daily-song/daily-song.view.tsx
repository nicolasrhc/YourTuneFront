import { Component, Fragment, ReactNode } from "react";
import { RouteChildrenProps } from "react-router-dom";
import { PruebaAPI, SPTrack } from "../../api/api";
import { Undefinable } from "../../utils/undefinable";
import { ReactCookieProps, withCookies } from "react-cookie";
import { Table } from "antd";
import { SPTrackArtista } from "../dashboard/home/home.view";

export interface SPPlaylistTrack {
    added_at: string;
    track: SPTrack;
}

export interface SPPlaylistSongTrack extends SPTrackArtista {
    added_at: string;
    index: number;
}

export type DailySongViewProps = RouteChildrenProps & ReactCookieProps;
export interface DailySongViewState {
    cancion: Undefinable<SPTrack>;
    canciones: Undefinable<SPPlaylistSongTrack[]>;
    loadingTop: boolean;
    tieneDailySong: Undefinable<boolean>;
}

export class _DailySongView extends Component<DailySongViewProps, DailySongViewState> {

    readonly state: DailySongViewState = {
        cancion: undefined,
        canciones: undefined,
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
        {
            title: "Añadido",
            dataIndex: "added_at",
            key: "added_at",
        },
    ];

    constructor (props: DailySongViewProps) {
        super (props);

        this.setDailySong = this.setDailySong.bind(this);
    }

    async componentDidMount(): Promise<void> {
        await this.getDailySongs();
        await this.setDailySong();
    }

    async setDailySong (): Promise<void> {
        try {
            const response = await new PruebaAPI().crearDailySong();
            this.setState({ cancion: response?.data });
            await this.getDailySongs()
        } catch (e) {
            console.log(e);
        }
    }

    async obtenerTieneDailySong(): Promise<void> {
        try {
            const tieneDailySong = (await new PruebaAPI().usuarioTieneDailySong())?.data;

            this.setState({ tieneDailySong });
        } catch(error) {
            console.error(error);
        }
    }

    setTopLoading (loadingTop: boolean): void {
        this.setState({ loadingTop });
    }

    async getDailySongs (): Promise<void> {
        try {
            this.setTopLoading(true);
            const artistData = await new PruebaAPI().obtenerDailySongs();
            const canciones = artistData?.data.reverse();
    
            const cancionesCount: SPPlaylistSongTrack[] = []
            canciones?.forEach((cancion, index) => {
                const newCancion: SPPlaylistSongTrack = {
                    ...cancion.track,
                    albumName: cancion.track.album.name,
                    artistaName: cancion.track.artists[0].name,
                    key: cancion.track.id,
                    added_at: new Date(cancion.added_at).toLocaleDateString(),
                    index: index + 1,
                }
                cancionesCount.push(newCancion)
            })
            this.setState({canciones: cancionesCount, loadingTop: false})
            this.setTopLoading(false);
        } catch (e) {
            console.log(e);
        }
    }

    async pruebaToken():Promise<void> {
        await new PruebaAPI().refreshToken();
    }

    render (): ReactNode {
        return (
            <Fragment>
                {
                    this.state.cancion && (
                        <div className="row m-0 mt-2">
                            <div className="col-2">
                                <img style={{ borderRadius: "50%", height: "20vh"}} src={this.state.cancion.album.images[1].url} alt={this.state.cancion.name}></img>
                            </div>
                            <div className="col-8 m-0">
                                <div style={{ textOverflow: "ellipsis"}} className="nombre-artista-dashboard">{this.state.cancion.name}</div>
                            </div>
                            <div className="col-1">
                                <div className="nombre-artista-general">{this.state.cancion.artists[0].name}</div>
                            </div>
                        </div>
                    )
                }
                <div className="p-4">
                    <div>Mis daily songs</div>
                    <Table
                        dataSource={this.state.canciones}
                        columns={this.columns}
                        loading={this.state.loadingTop}
                        pagination={false}
                        scroll={{ y: "58vh" }}
                    />
                </div>
            </Fragment>
        )
    }
}

export const DailySongView = withCookies(_DailySongView);