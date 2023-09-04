import { FormikProps, withFormik } from "formik";
import { Component, Fragment, ReactNode } from "react";
import { PruebaAPI, SPArtist, SPPlaylist } from "../../api/api";
import { SPButton } from "../../components/button/sp-button.component";
import { Undefinable } from "../../utils/undefinable";
import { SPInput } from "../../components/input/sp-input.component";
import { SPSearchInput } from "../../components/search-input/search-input.component";
import { SPSelect } from "../../components/select/sp-select.component";
import { Option } from "antd/es/mentions";
import logo_spotify from "../../img/logo_login.jpeg"; //1280x860

export type seleccionType = "genero" | "artista";

export interface SPArtistSelect extends SPArtist {
    idSelect: string;
}

export interface FormNuevaPlaylist {
    namePlaylist: Undefinable<string>;
    idPlaylist: Undefinable<string>;
    seleccion: Undefinable<seleccionType>
    idSeleccion: Undefinable<string>;
    idSeleccionados: Undefinable<{id: string, name: string}[]>;
}

export interface FormNuevaPlaylistValidated extends FormNuevaPlaylist {
    namePlaylist: string;
    idPlaylist: string;
    seleccion: seleccionType
    idSeleccionados: {id: string, name: string}[];
}

export interface PruebaFormOuterProps {
    crearPlaylist: (namePlaylist: string, idPlaylist: string, idSeleccionados: string[]) => Promise<void>;
}

export interface NuevaPlaylistFormState {
    playlists: Undefinable<SPPlaylist[]>;
}

export class _NuevaPlaylistForm extends Component<FormikProps<FormNuevaPlaylist>, NuevaPlaylistFormState> {

    readonly state: NuevaPlaylistFormState = {
        playlists: undefined,
    }

    get isCrearDisabled(): boolean {
        return this.props.values.namePlaylist === ""
        || this.props.values.namePlaylist === undefined
        || this.props.values.idPlaylist === undefined
        || this.props.values.idSeleccionados?.length === 0
        || this.props.values.idSeleccionados === undefined
    }

    get isAniadirDisabled(): boolean {
        return this.props.values.idSeleccion === undefined;
    }

    constructor (props: FormikProps<FormNuevaPlaylist>) {
        super (props);

        this.obtenerArtistas = this.obtenerArtistas.bind(this);
        this.handleAniadirSeleccion = this.handleAniadirSeleccion.bind(this);
    }

    async componentDidMount(): Promise<void> {
        await this.obtenerPlaylists();
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
        const idSeleccionados = this.props.values.idSeleccionados ? [...this.props.values.idSeleccionados!] : [];
        idSeleccionados.push({
            id: this.props.values.idSeleccion!.split("-_-")[0],
            name: this.props.values.idSeleccion!.split("-_-")[1],
        })
        this.props.setValues({
            ...this.props.values,
            idSeleccionados,
            idSeleccion: undefined,
        })
    }

    render(): ReactNode {
        return (
            <div>
                <div>Crea una playlist a partir de otra con tus artistas favoritos!</div>
                <label className="mb-3">Nombre de la playlist</label>
                <div className="mb-3">
                    <SPInput<FormNuevaPlaylist>
                        name="namePlaylist"
                        onChange={this.props.handleChange}
                        value={this.props.values.namePlaylist}
                    />
                </div>
                <label className="label-buscador mb-3">Elige la playlist</label>
                <div className="mb-3">
                    <SPSelect<FormNuevaPlaylist>
                        name="idPlaylist"
                        onChange={this.props.handleChange}
                        value={this.props.values.idPlaylist}
                        style={{width: 200}}
                    >
                        {
                            this.state.playlists?.map(playlist => (
                                <Option
                                    value={playlist.id}
                                    key={playlist.id}
                                >
                                    {playlist.name}
                                </Option>
                            ))
                        }
                    </SPSelect>
                </div>
                {
                    this.props.values.seleccion === "artista" && (
                        <Fragment>
                            <label className="label-buscador mb-3">Artista</label>
                            <div className="mb-3">
                                <SPSearchInput<FormNuevaPlaylist, SPArtistSelect>
                                    name="idSeleccion"
                                    value={this.props.values.idSeleccion}
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
                                    this.props.values.idSeleccionados?.map(artista => (
                                        <div>
                                            <div>{artista.name}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </Fragment>
                    )
                }
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

export const NuevaPlaylistForm = withFormik<PruebaFormOuterProps, FormNuevaPlaylist>({
    handleSubmit: async (values: FormNuevaPlaylist, { props, resetForm }) => {
        const valuesValidated: FormNuevaPlaylistValidated = values as FormNuevaPlaylistValidated;
        await props.crearPlaylist(valuesValidated.idPlaylist, valuesValidated.namePlaylist, valuesValidated.idSeleccionados.map(artista => artista.id));
        resetForm();
    },
    mapPropsToValues: () => ({
        namePlaylist: undefined,
        idPlaylist: undefined,
        seleccion: "artista",
        idSeleccion: undefined,
        idSeleccionados: undefined,
    })
})(_NuevaPlaylistForm);