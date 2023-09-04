import { Component, ReactNode } from "react";
import { PruebaAPI } from "../../../api/api";
import { Undefinable } from "../../../utils/undefinable";
import { SPCommunity } from "../communities.view";
import { BuscadorComunidadesForm } from "./buscador-comunidades.form";
import { RouteChildrenProps } from "react-router-dom";

export interface BuscadorComunidadesViewState {
    comunidades: Undefinable<SPCommunity[]>;
    artistas: {id: string, name: string}[];
}

export class BuscadorComunidadesView extends Component<RouteChildrenProps, BuscadorComunidadesViewState> {
    readonly state: BuscadorComunidadesViewState = {
        comunidades: undefined,
        artistas: [],
    }

    constructor (props: RouteChildrenProps) {
        super (props);

        this.getCommunities = this.getCommunities.bind(this);
        this.getNombreArtista = this.getNombreArtista.bind(this);
        this.goToDetalle = this.goToDetalle.bind(this);
    }

    async componentDidMount(): Promise<void> {
        await this.getCommunities(undefined, undefined);
    }

    async getCommunities (nombre: Undefinable<string>, artista: Undefinable<string>): Promise<void> {
        try {
            const comunidadesData = await new PruebaAPI().obtenerComunidadesFiltradas({artista, nombre});
            const comunidades: SPCommunity[] = comunidadesData?.data;

            const artistas = new Set<string>(); 
            comunidades.forEach(comunidad => {
                comunidad.artistas.forEach(artista => {
                    artistas.add(artista);
                })
            });

            const artistasName: {id: string, name: string}[] = [];
            await Promise.all(Array.from(artistas).map(async artista => {
                const artistaData = await new PruebaAPI().obtenerArtistaById(artista);
                artistasName.push({id: artista, name: artistaData!.data.body.name});
            }));
    
            this.setState({ comunidades, artistas: artistasName })
        } catch (e) {
            console.log(e);
        }
    }

    getNombreArtista(idArtista: string): string {
        const artistas = this.state.artistas.filter(artista => artista.id === idArtista);
        return  artistas.length ? artistas[0].name : "";
    }

    goToDetalle(idComunidad: string): React.MouseEventHandler<HTMLDivElement> {
        return (event ) => {
            this.props.history.push(idComunidad);
        }
    }

    render (): ReactNode {
        return (
            <div className="p-4">
                <div>
                    <BuscadorComunidadesForm
                        buscarComunidades={this.getCommunities}
                    />
                </div>
                <div className="row">
                    {this.state.comunidades?.map((comunidad, index)  => (
                        <div className="col-2 ml-1 mt-1" key={index}>
                            <div className="comunidad p-1" onClick={this.goToDetalle(comunidad._id)}>
                                <div style={{height: "60%"}}>{comunidad.nombre}</div>
                                <div className="nombre-artista-general" style={{height: "20%"}}>{this.getNombreArtista(comunidad.artistas[0])}</div>
                                <div style={{height: "20%"}} className="d-flex justify-content-end">{comunidad.num_usuarios}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}