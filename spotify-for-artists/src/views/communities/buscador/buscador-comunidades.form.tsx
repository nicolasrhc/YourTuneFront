import { FormikProps, withFormik } from "formik";
import { Component, ReactNode } from "react";
import { PruebaAPI, SPArtist } from "../../../api/api";
import { SPButton } from "../../../components/button/sp-button.component";
import { Undefinable } from "../../../utils/undefinable";
import { SPInput } from "../../../components/input/sp-input.component";
import { SPSearchInput } from "../../../components/search-input/search-input.component";
import { SPArtistSelect } from "../../playlists/nuevaPlaylist.form";
import logo_spotify from "../../../img/logo_login.jpeg"; //1280x860

export type seleccionType = "genero" | "artista";

export interface FormBuscadorComunidad {
    nameComunidad: Undefinable<string>;
    idArtista: Undefinable<string>;
}

export interface PruebaFormOuterProps {
    buscarComunidades: (namePlaylist: Undefinable<string>, idArtista: Undefinable<string>) => Promise<void>;
}

export class _BuscadorComunidadesForm extends Component<FormikProps<FormBuscadorComunidad>> {

    constructor (props: FormikProps<FormBuscadorComunidad>) {
        super (props);

        this.obtenerArtistas = this.obtenerArtistas.bind(this);
    }

    async obtenerPlaylists (): Promise<void> {
        try {
            const response = await new PruebaAPI().obtenerPlaylistsUsuario()
            this.setState({playlists: response?.data})
        } catch (e) {
            console.log(e);
        }
    }

    getArtistLabel(artista: SPArtist): ReactNode {
        const image = artista.images.length > 0 ? artista.images[0].url : logo_spotify;
        return (
            <div>
                <img
                    className={"img-logo-login mt-3"}
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

    async obtenerArtistas (name: string): Promise<Undefinable<SPArtistSelect[]>> {
        try {
            const response = await new PruebaAPI().obtenerArtistasBuscador(name)
            return response?.data.map(artista => {
                return {
                    ...artista,
                    idSelect: artista.id,
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    render(): ReactNode {
        return (
            <div className="row">
                <div className="col-2">
                    <label className="mb-3">Nombre de la comunidad</label>
                    <div className="mb-3" style={{width: "200"}}>
                        <SPInput<FormBuscadorComunidad>
                            name="nameComunidad"
                            onChange={this.props.handleChange}
                            value={this.props.values.nameComunidad}
                            style={{width: 200}}
                        />
                    </div>
                </div>
                <div className="col-2">
                    <label className="label-buscador mb-3">Artista</label>
                    <div className="mb-3">
                        <SPSearchInput<FormBuscadorComunidad, SPArtistSelect>
                            name="idArtista"
                            value={this.props.values.idArtista}
                            onChange={this.props.handleChange}
                            onSearch={this.obtenerArtistas}
                            onSetLabel={this.getArtistLabel}
                            valueKey="idSelect"
                        />
                    </div>
                </div>
                <div className="col-2">
                    <SPButton
                        onClick={this.props.handleSubmit}
                        type={"primary"}
                        style={{marginTop: "40px"}}
                    >
                        Buscar
                    </SPButton>
                </div>
            </div>
        )
    }
}

export const BuscadorComunidadesForm = withFormik<PruebaFormOuterProps, FormBuscadorComunidad>({
    handleSubmit: async (values: FormBuscadorComunidad, { props, resetForm }) => {
        await props.buscarComunidades(values.nameComunidad, values.idArtista);
    },
    mapPropsToValues: () => ({
        nameComunidad: undefined,
        idArtista: undefined,
    })
})(_BuscadorComunidadesForm);