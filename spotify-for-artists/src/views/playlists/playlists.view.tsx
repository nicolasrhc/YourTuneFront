import { Modal } from "antd";
import { CSSProperties, Component, ReactNode } from "react";
import { withCookies } from "react-cookie";
import { Undefinable } from "../../utils/undefinable";
import { PruebaAPI, SPPlaylist } from "../../api/api";
import { NuevaPlaylistForm } from "./nuevaPlaylist.form";
import { PlusSquareOutlined } from "@ant-design/icons";

export interface PlaylistsViewState {
    userPlaylists: Undefinable<SPPlaylistGrid[]>;
    loadingTop: boolean;
    isVisibleModalCrear: boolean;
}

export interface SPPlaylistGrid extends SPPlaylist {
    key: string;
}

export class _PlaylistsView extends Component<{}, PlaylistsViewState> {
    
    readonly columns = [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Playlist",
            dataIndex: "name",
            key: "name",
        },
    ];

    readonly state: PlaylistsViewState = {
        userPlaylists: undefined,
        loadingTop: false,
        isVisibleModalCrear: false,
    }

    constructor (props: any) {
        super (props);

        this.createPlaylist = this.createPlaylist.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    async componentDidMount(): Promise<void> {
        await this.getUserPlaylists();
    }

    async getUserPlaylists (): Promise<void> {
        try {
            this.setTopLoading(true);
            const response = await new PruebaAPI().obtenerPlaylistsUsuario();

            const playlists = response?.data.map(play => {
                return {
                    ...play,
                    key: play.id,
                }
            })

            this.setState({userPlaylists: playlists, loadingTop: false})
            this.setTopLoading(false);
        } catch (e) {
            console.log(e);
        }
    }

    async createPlaylist (idPlaylist: string, namePlaylist: string, idSeleccionados: string[]): Promise<void> {
        try {
            await new PruebaAPI().crearPlaylistPorOtra(namePlaylist, idPlaylist, idSeleccionados);
            await this.getUserPlaylists();
            this.closeModal();
        } catch (e) {
            console.log(e);
        }
    }

    openModal (): void {
        this.setState({ isVisibleModalCrear: true });
    }

    closeModal (): void {
        this.setState({ isVisibleModalCrear: false });
    }

    setTopLoading (loadingTop: boolean): void {
        this.setState({ loadingTop });
    }

    getPlaylistImg (playlist: SPPlaylistGrid): string {
        return playlist.images[1] ? playlist.images[1].url : playlist.images[0].url;
    }

    goToPlaylist(urlPlaylist: string): React.MouseEventHandler<HTMLDivElement> {
        return (event) => {
            window.open(urlPlaylist);
        }
    }

    setPlaylistStyle(playlist: SPPlaylistGrid): CSSProperties {
        return playlist.images.length > 0 ? {
            backgroundImage: `url(${this.getPlaylistImg(playlist)})`,
            backgroundSize: 200
        } : {
            background: "linear-gradient(222deg, rgba(0,0,0,1) 0%, rgba(40,44,52,1) 100%)"
        }
    }

    render (): ReactNode {
        return (
            <div className="p-4">
                <div className="nombre-artista-dashboard">Mis Playlists</div>
                <div className="row">
                    <div className="col-2 ml-1 mt-3">
                        <PlusSquareOutlined style={{fontSize: "200px", cursor: "pointer"}} rev={{}} onClick={this.openModal}/>
                    </div>
                    {this.state.userPlaylists?.map((playlist, index)  => (
                        <div className="col-2 ml-1 mt-1" key={index}>
                            <div
                            onClick={this.goToPlaylist(playlist.external_urls.spotify)}
                                className="playlist p-1"
                                style={this.setPlaylistStyle(playlist)}
                            >
                                <div>{playlist.name}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <Modal
                    open={this.state.isVisibleModalCrear}
                    style={{height: "10vh"}}
                    onCancel={this.closeModal}
                    footer={false}
                >
                    <NuevaPlaylistForm
                        crearPlaylist={this.createPlaylist}
                    />
                </Modal>
            </div>
        )
    }
}

export const PlaylistsView = withCookies(_PlaylistsView);