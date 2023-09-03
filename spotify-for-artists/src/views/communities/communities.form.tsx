import { FormikProps, withFormik } from "formik";
import { Component, Fragment, ReactNode } from "react";
import { PruebaAPI, SPArtist, SPPlaylist } from "../../api/api";
import { SPButton } from "../../components/button/sp-button.component";
import { Undefinable } from "../../utils/undefinable";
import { SPInput } from "../../components/input/sp-input.component";
import { SPSearchInput } from "../../components/search-input/search-input.component";
import { SPArtistSelect } from "../playlists/nuevaPlaylist.form";
import logo_spotify from "../../img/logo_login.jpeg"; //1280x860

export type seleccionType = "genero" | "artista";

export interface FormNuevaComunidad {
    nameComunidad: Undefinable<string>;
    descripcion: Undefinable<string>;
    artistas: {id: string, name: string}[];
    idSeleccionArtista: Undefinable<string>;
}

export interface FormNuevaComunidadValidated extends FormNuevaComunidad {
    nameComunidad: string;
    descripcion: string;
    artistas: {id: string, name: string}[];
}

export interface PruebaFormOuterProps {
    crearComunidad: (namePlaylist: string, descripcion: string, artistas: string[]) => Promise<void>;
}

export interface NuevaComunidadFormState {
    playlists: Undefinable<SPPlaylist[]>;
}

export class _NuevaComunidadForm extends Component<FormikProps<FormNuevaComunidad>, NuevaComunidadFormState> {

    readonly state: NuevaComunidadFormState = {
        playlists: undefined,
    }

    get isCrearDisabled(): boolean {
        return this.props.values.nameComunidad === ""
        || this.props.values.nameComunidad === undefined
        || this.props.values.descripcion === undefined
        || this.props.values.descripcion === ""
        || this.props.values.artistas?.length === 0
        || this.props.values.artistas === undefined
    }

    get isAniadirDisabled(): boolean {
        return this.props.values.idSeleccionArtista === undefined;
    }

    constructor (props: FormikProps<FormNuevaComunidad>) {
        super (props);

        this.obtenerArtistas = this.obtenerArtistas.bind(this);
        this.handleAniadirSeleccion = this.handleAniadirSeleccion.bind(this);
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
                    idSelect: artista.id + "-_-" + artista.name,
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    handleAniadirSeleccion(): void {
        const artistas = this.props.values.artistas ? [...this.props.values.artistas!] : [];
        artistas.push({
            id: this.props.values.idSeleccionArtista!.split("-_-")[0],
            name: this.props.values.idSeleccionArtista!.split("-_-")[1],
        })
        this.props.setValues({
            ...this.props.values,
            artistas,
            idSeleccionArtista: undefined,
        })
    }

    render(): ReactNode {
        return (
            <div>
                <label className="mb-3">Nombre de la comunidad</label>
                <div className="mb-3">
                    <SPInput<FormNuevaComunidad>
                        name="nameComunidad"
                        onChange={this.props.handleChange}
                        value={this.props.values.nameComunidad}
                    />
                </div>
                <label className="mb-3">Descripción</label>
                <div className="mb-3">
                    <SPInput<FormNuevaComunidad>
                        name="descripcion"
                        onChange={this.props.handleChange}
                        value={this.props.values.descripcion}
                    />
                </div>
                <Fragment>
                    <label className="label-buscador mb-3">Artista</label>
                    <div className="mb-3">
                        <SPSearchInput<FormNuevaComunidad, SPArtistSelect>
                            name="idSeleccionArtista"
                            value={this.props.values.idSeleccionArtista}
                            onChange={this.props.handleChange}
                            onSearch={this.obtenerArtistas}
                            onSetLabel={this.getArtistLabel}
                            valueKey="idSelect"
                            style={{marginRight: "20px"}}
                        />
                        <SPButton
                            onClick={this.handleAniadirSeleccion}
                            type={"primary"}
                            disabled={this.isAniadirDisabled}
                        >
                            Añadir
                        </SPButton>
                    </div>
                    <div>
                        {
                            this.props.values.artistas?.map(artista => (
                                <div key={artista.id}>
                                    <div>{artista.name}</div>
                                </div>
                            ))
                        }
                    </div>
                </Fragment>
                <div className="d-flex justify-content-end">
                    <SPButton
                        onClick={this.props.handleSubmit}
                        type={"primary"}
                        disabled={this.isCrearDisabled}
                    >
                        Crear
                    </SPButton>
                </div>
            </div>
        )
    }
}

export const NuevaComunidadForm = withFormik<PruebaFormOuterProps, FormNuevaComunidad>({
    handleSubmit: async (values: FormNuevaComunidad, { props, resetForm }) => {
        const valuesValidated: FormNuevaComunidadValidated = values as FormNuevaComunidadValidated;
        await props.crearComunidad(valuesValidated.nameComunidad, valuesValidated.descripcion, valuesValidated.artistas.map(artista => artista.id));
        resetForm();
    },
    mapPropsToValues: () => ({
        nameComunidad: undefined,
        descripcion: undefined,
        artistas: [],
        idSeleccionArtista: undefined,
    })
})(_NuevaComunidadForm);