import { Component, Fragment, ReactNode } from "react";
import { PruebaAPI, SPTrack } from "../../../api/api";
import { Undefinable } from "../../../utils/undefinable";

export interface ConCancionViewState {
    cancion: Undefinable<SPTrack>;
}

export class ConCancionView extends Component<{}, ConCancionViewState> {

    readonly state: ConCancionViewState = {
        cancion: undefined,
    }

    async componentDidMount(): Promise<void> {
        await this.obtenerCancion();
    }

    async obtenerCancion(): Promise<void> {
        try {
            const cancion = await new PruebaAPI().obtenerDailySong();
            this.setState({ cancion: cancion?.data });
        } catch (error) {
            console.error(error);
        }
    }

    render(): ReactNode {
        return (
            <Fragment>
                {this.state.cancion && (
                <div className="row m-0">
                    <div className="col-9" style={{paddingTop: "2vh"}}>
                        <div>{this.state.cancion.name}</div>
                        <div className="nombre-artista-general">{this.state.cancion.artists[0].name}</div>
                    </div>
                    <div className="col-3">
                        <img height={"90px"} src={this.state.cancion?.album.images[0].url} alt={this.state.cancion.name}/>
                    </div>
                </div>
                )}
            </Fragment>
        );
    }
}