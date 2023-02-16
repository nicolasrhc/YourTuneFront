import axios, { AxiosResponse } from "axios";
import { Cookies } from "react-cookie";
import { Undefinable } from "../utils/undefinable";

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
    followers: {
        total: number;
    };
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


    async obtenerAlbumsYgritte (): Promise<Undefinable<AxiosResponse<NetworkResponse<SPAlbums>>>> {
        try {
            return await this.get("albums")
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerArtistaYgritte (): Promise<Undefinable<AxiosResponse<NetworkResponse<SPArtist>>>> {
        try {
            return await this.get("artist")
        } catch (error) {
            console.error(error);
        }
    }
}