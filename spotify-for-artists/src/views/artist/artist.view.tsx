import { Component, Fragment, ReactNode } from "react";
import { RouteChildrenProps } from "react-router-dom";
import { PruebaAPI, SPArtist, SPTrack } from "../../api/api";
import { Undefinable } from "../../utils/undefinable";
import { Table } from "antd";
import { SPTrackArtistaGrid } from "../dashboard/home/home.view";
import { SPButton } from "../../components/button/sp-button.component";

export type ArtistaViewProps = RouteChildrenProps;

export interface ArtistaViewState {
    artist: Undefinable<SPArtist>;
    topCanciones: Undefinable<SPTrackArtistaGrid[]>;
    loadingTop: boolean;
}

export class ArtistaView extends Component<ArtistaViewProps, ArtistaViewState> {

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

    readonly state: ArtistaViewState = {
        artist: undefined,
        loadingTop: false,
        topCanciones: undefined,
    }

    constructor (props: ArtistaViewProps) {
        super (props);

        this.createArtistPlaylist = this.createArtistPlaylist.bind(this);
    }

    async componentDidMount(): Promise<void> {
        const idArtista = (this.props.match?.params as any).idArtista;
        await this.setArtista(idArtista);
    }

    async componentDidUpdate(prevProps: ArtistaViewProps): Promise<void> {
        const idArtista = (this.props.match?.params as any).idArtista;
        if (idArtista !== (prevProps.match?.params as any).idArtista) {
            await this.setArtista(idArtista);
        }
    }

    getClassName(popularidad: number): string {
        let resultado = "row m-0 mitico";

        if (popularidad < 5) {
            resultado = "row m-0 comun";
        } else if (popularidad <25) {
            resultado = "row m-0 poco-comun";
        } else if (popularidad <45) {
            resultado = "row m-0 raro";
        } else if (popularidad <65) {
            resultado = "row m-0 epico";
        } else if (popularidad <85) {
            resultado = "row m-0 legendario";
        }

        return resultado;
    }

    async setArtista (idArtista: string): Promise<void> {
        const artista = await new PruebaAPI().obtenerArtistaById(idArtista);
        await this.getArtistTopTracks(idArtista);
        this.setState({ artist: artista?.data.body });
    }

    setTopLoading (loadingTop: boolean): void {
        this.setState({ loadingTop });
    }

    async getArtistTopTracks(idArtista: string): Promise<void> {
        this.setTopLoading(true);
        const artistData = await new PruebaAPI().obtenerArtistaTopCanciones(idArtista);
        const canciones: SPTrack[] = artistData?.data.body.tracks;

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

    async createArtistPlaylist(): Promise<void> {
        try {
            if (this.state.artist) {
                await new PruebaAPI().createTopSongsArtistPlaylist(this.state.artist.id);
            }
        } catch (e) {
            console.log(e);
        }
    }

    render (): ReactNode {
        return (
            this.state.artist && (
                <Fragment>
                    <div className={this.getClassName(this.state.artist.popularity)} style={{height: "25vh"}}>
                        <div className="col-2">
                            <img
                                style={{ borderRadius: "50%", marginTop: "2.5vh", height: "20vh"}}
                                src={this.state.artist.images[1].url}
                                alt={this.state.artist.name}
                            ></img>
                        </div>
                        <div className="col-8 m-0">
                            <div style={{ textOverflow: "ellipsis"}} className="nombre-artista-dashboard">{this.state.artist.name}</div>
                        </div>
                        <div className="col-1">
                            <div>Seguidores</div>
                            <div>{this.state.artist.followers.total}</div>
                        </div>
                        <div className="col-1">
                            <SPButton
                                onClick={this.createArtistPlaylist}
                                type={"primary"}
                            >
                                Crear playlist
                            </SPButton>
                        </div>
                    </div>
                    <div>Top Canciones</div>
                    <div style={{height: "60vh"}}>
                        <Table
                            dataSource={this.state.topCanciones?.slice(0, 10)}
                            columns={this.columns}
                            pagination={false}
                            loading={this.state.loadingTop}
                            scroll={{ y: "58vh" }}
                        />
                    </div>
                </Fragment>
            )
        )
    }
}