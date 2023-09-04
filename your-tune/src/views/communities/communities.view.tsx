import { Component, Fragment, ReactNode } from "react";
import { NuevaComunidadForm } from "./communities.form";
import { PruebaAPI } from "../../api/api";
import { Undefinable } from "../../utils/undefinable";
import { Button, Modal, Popover } from "antd";
import { RouteChildrenProps } from "react-router-dom";
import { PlusSquareOutlined } from "@ant-design/icons";

export interface SPCommunity {
    nombre: string;
    descripcion: string;
    generos: string[];
    artistas: string[];
    num_usuarios: number;
    _id: string;
}

export interface ComunidadesViewState {
    comunidades: Undefinable<SPCommunity[]>
    artistas: {id: string, name: string}[];
    isOpenModalComunidad: boolean;
    isOpenPopover: boolean;
}

export class ComunidadesView extends Component<RouteChildrenProps, ComunidadesViewState> {
    readonly state: ComunidadesViewState = {
        comunidades: undefined,
        artistas: [],
        isOpenModalComunidad: false,
        isOpenPopover: false,
    }

    constructor (props: any) {
        super (props);

        this.createComunidad = this.createComunidad.bind(this);
        this.getNombreArtista = this.getNombreArtista.bind(this);
        this.goToDetalle = this.goToDetalle.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.popoverContent = this.popoverContent.bind(this);
        this.handlePopoverChange = this.handlePopoverChange.bind(this);
        this.goToBuscar = this.goToBuscar.bind(this);
    }

    async componentDidMount(): Promise<void> {
        await this.getCommunities();
    }

    async createComunidad (nameComunidad: string, descripcion: string, artistas: string[]): Promise<void> {
        try {
            const comunidad = await new PruebaAPI().crearComunidad(nameComunidad, descripcion, artistas);
            this.setState({isOpenModalComunidad: false});
            if(comunidad) {
                this.props.history.push("communities/" + comunidad.data._id)
            }
        } catch (e) {
            console.log(e);
        }
    }

    async getCommunities (): Promise<void> {
        try {
            const comunidadesData = await new PruebaAPI().obtenerComunidadesUsuario();
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
        return (event) => {
            this.props.history.push("communities/" + idComunidad);
        }
    }

    goToBuscar(): void {
        this.props.history.push("communities/search");
    }

    openModal(): void {
        this.setState({isOpenModalComunidad: true, isOpenPopover: false});
    }

    closeModal(): void {
        this.setState({isOpenModalComunidad: false});
    }

    popoverContent(): ReactNode {
        return (
            <Fragment>
                <Button
                    onClick={this.openModal}
                    type={"primary"}
                    style={{marginRight: "20px"}}
                >
                    Crear
                </Button>
                <Button
                    onClick={this.goToBuscar}
                    type={"primary"}
                >
                    Buscar
                </Button>
            </Fragment>
        )
    }

    handlePopoverChange(open: boolean) {
        this.setState({isOpenPopover: open})
    }

    render (): ReactNode {
        return (
            <div className="p-4">
                <div className="nombre-artista-dashboard">Mis comunidades</div>
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
                    <div className="col-2 ml-1 mt-1">
                        <Popover
                            content={this.popoverContent}
                            trigger="click"
                            open={this.state.isOpenPopover}
                            onOpenChange={this.handlePopoverChange}
                        >
                            <PlusSquareOutlined style={{fontSize: "200px", cursor: "pointer"}} rev={{}}/>
                        </Popover>
                    </div>
                </div>
                <Modal
                    open={this.state.isOpenModalComunidad}
                    onCancel={this.closeModal}
                    footer={null}
                >
                    <NuevaComunidadForm
                        crearComunidad={this.createComunidad}
                    />
                </Modal>
            </div>
        );
    }
}