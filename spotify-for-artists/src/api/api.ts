import axios, { AxiosResponse } from "axios";
import { Cookies } from "react-cookie";
import { Undefinable } from "../utils/undefinable";
import { SPPlaylistTrack } from "../views/daily-song/daily-song.view";
import { SPCommunity } from "../views/communities/communities.view";
import { SPPost } from "../views/communities/communitiesDetail.view";

export interface SPPrueba {
    category: string;
    title: string;
}

export interface SPImage {
    width: number;
    heigth: number;
    url: string;
}

export interface SPAlbum {
    album_type: string;
    id: string;
    name: string;
    total_tracks: number;
    uri: string;
    images: SPImage[];
}

export interface Album {
    album_type: string;
    id: string;
    name: string;
    total_tracks: number;
    uri: string;
    images: SPImage[];
    playcount: number;
}

export interface SPAlbums {
    items: SPAlbum[];
}

export enum SPTypeEnum {
    album = "album",
    cancion = "track",
    artista = "artist",
}

export interface SPArtist {
    id: string;
    type: SPTypeEnum;
    name: string;
    images: SPImage[];
    genres: string[];
    popularity: number;
    followers: {
        total: number;
    };
}

export interface LFMArtist {
    name: string;
    stats: {
        listeners: number,
        playcount: number,
    }
}

export interface SPTrack {
    artists: SPArtist[];
    name: string;
    id: string;
    album: SPAlbum;
}

export interface SPUser{
    images: SPImage[];
    display_name: string;
    id: string;
    followers: {
        total: number;
    };
}

export interface SPUserDDBB{
    communities_ids: string[];
    spotify_id: string;
    _id: string;
}

export interface SPPlaylist {
    collaborative: boolean;
    description: string;
    images: SPImage[];
    name: string;
    id: string;
    external_urls: {
        spotify: string;
    }
}

export interface NetworkResponse<T> {
    body: T
}

export class PruebaAPI {

    private async get (url: string, config?: any): Promise<Undefinable<AxiosResponse<NetworkResponse<SPAlbums>>> | any> {
        const configAux = {
            ...config,
            headers: { Authorization: new Cookies().get("token") }
        };

        try {
            return await axios.get("http://localhost:8888/" + url, configAux)
        } catch (error) {
            return error;
        }
    }

    private async post (url: string, body: any, config?: any): Promise<Undefinable<AxiosResponse<NetworkResponse<any>>> | any> {
        const configAux = {
            ...config,
            headers: { Authorization: new Cookies().get("token") }
        };

        try {
            return await axios.post("http://localhost:8888/" + url, body, configAux)
        } catch (error) {
            return error;
        }
    }


    async obtenerAlbumsYgritte (): Promise<Undefinable<AxiosResponse<NetworkResponse<SPAlbums>>>> {
        try {
            return await this.get("spotify/albums")
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerArtistaById (idArtista: string): Promise<Undefinable<AxiosResponse<NetworkResponse<SPArtist>>>> {
        try {
            return await this.get("spotify/artist/" + idArtista)
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerArtistasBuscador (artista: string): Promise<Undefinable<AxiosResponse<SPArtist[]>>> {
        try {
            return await this.get("spotify/artistas/" + artista);
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerYo (): Promise<any> {
        try {
            return await this.get("yo");
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerCancion (): Promise<any> {
        try {
            return await this.get("cancion");
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerArtistaTopCanciones (idArtista: string): Promise<any> {
        try {
            return await this.get("spotify/artist-top-tracks/" + idArtista);
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerUserTopCanciones (): Promise<any> {
        try {
            return await this.get("spotify/user-top-tracks");
        } catch (error) {
            console.error(error);
        }
    }

    async crearDailySong (): Promise<Undefinable<AxiosResponse<SPTrack>>> {
        try {
            return await this.get("spotify/daily-song");
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerDailySongs (): Promise<Undefinable<AxiosResponse<SPPlaylistTrack[]>>> {
        try {
            return await this.get("spotify/user-daily-songs");
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerDailySong (): Promise<Undefinable<AxiosResponse<SPTrack>>> {
        try {
            return await this.get("spotify/user-daily-song");
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerCurrentUser (): Promise<Undefinable<AxiosResponse<SPUser>>> {
        try {
            return await this.get("spotify/current-user");
        } catch (error) {
            console.error(error);
        }
    }

    async usuarioTieneDailySong (): Promise<Undefinable<AxiosResponse<boolean>>> {
        try {
            return await this.get("spotify/user-have-daily-song");
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerPlaylistsUsuario (): Promise<Undefinable<AxiosResponse<SPPlaylist[]>>> {
        try {
            return await this.get("spotify/user-playlists");
        } catch (error) {
            console.error(error);
        }
    }

    async crearPlaylistPorOtra (nombre_playlist: string, id_playlist: string, ids_seleccion: string[]): Promise<void> {
        try {
            await this.post("spotify/create-playlist-by-other", { nombre_playlist, id_playlist, ids_seleccion });
        } catch (error) {
            console.error(error);
        }
    }

    async createTopSongsArtistPlaylist (idArtista: string): Promise<void> {
        try {
            await this.get("spotify/create-artist-playlist/" + idArtista,);
        } catch (error) {
            console.error(error);
        }
    }

    async refreshToken (): Promise<void> {
        try {
            await this.get("spotify/refresh-token");
        } catch (error) {
            console.error(error);
        }
    }

    async crearComunidad (nombre: string, descripcion: string, artistas: string[]): Promise<Undefinable<AxiosResponse<SPCommunity>>> {
        try {
            return await this.post("communities", { nombre, descripcion, artistas });
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerComunidades (): Promise<Undefinable<AxiosResponse<SPCommunity[]>>> {
        try {
            return await this.get("communities");
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerComunidadPorId (idComunidad: string): Promise<Undefinable<AxiosResponse<SPCommunity>>> {
        try {
            return await this.get("communities/" + idComunidad);
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerPostsComunidad (idComunidad: string): Promise<Undefinable<AxiosResponse<SPPost[]>>> {
        try {
            return await this.get("post/" + idComunidad);
        } catch (error) {
            console.error(error);
        }
    }

    async crearPost (message: string, id_community: string, id_parent_post: string): Promise<void> {
        try {
            const user = (await this.obtenerCurrentUser())?.data;
            if (user) {
                await this.post("post", { message, id_community, id_parent_post, id_user: user.id, user_name: user.display_name, user_image_url: user.images[0].url });
            }
        } catch (error) {
            console.error(error);
        }
    }

    async crearUsuario(): Promise<void> {
        try {
            await this.get("new-user");
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerComunidadesUsuario(): Promise<any> {
        try {
            return await this.get("communities/user");
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerComunidadesFiltradas(filtros: {nombre?: string, genero?: string, artista?: string}): Promise<any> {
        try {
            return await this.post("communities/filter", filtros);
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerUsuarioDDBB(): Promise<Undefinable<AxiosResponse<SPUserDDBB>>> {
        try {
            return await this.get("userddbb");
        } catch (error) {
            console.error(error);
        }
    }

    async followComunidad(idComunidad: string): Promise<any> {
        try {
            return await this.get("add-user-to-community/" + idComunidad);
        } catch (error) {
            console.error(error);
        }
    }

    async unfollowComunidad(idComunidad: string): Promise<any> {
        try {
            return await this.get("delete-user-to-community/" + idComunidad);
        } catch (error) {
            console.error(error);
        }
    }
}