import { Component, ReactNode } from "react";
import { ReactCookieProps, withCookies } from "react-cookie";
import { Undefinable } from "../../../utils/undefinable";
import { PruebaAPI, SPUser } from "../../../api/api";

export interface DashboardHeaderViewState {
    user: Undefinable<SPUser>;
}

export class _DashboardHeaderView extends Component<ReactCookieProps, DashboardHeaderViewState> {
    readonly state: DashboardHeaderViewState = {
        user: undefined,
    }
    async componentDidMount(): Promise<void> {
        await this.getUserData();
    }

    async getUserData(): Promise<void> {
        const userData = await new PruebaAPI().obtenerCurrentUser();
        await new PruebaAPI().crearUsuario();
        this.setState({user: userData?.data})
    }

    render(): ReactNode {
        return (
            <div>
                {
                    (this.state.user) && (
                        <div className="row m-0 mt-2">
                            <div className="col-2">
                                <img style={{ borderRadius: "50%", height: "20vh"}} src={this.state.user.images[1].url} alt={this.state.user.display_name}></img>
                            </div>
                            <div className="col-8 m-0">
                                <div style={{ textOverflow: "ellipsis"}} className="nombre-artista-dashboard">{this.state.user.display_name}</div>
                            </div>
                            <div className="col-1">
                                <div>Seguidores</div>
                                <div>{this.state.user.followers.total}</div>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}

export const DashboardHeaderView = withCookies(_DashboardHeaderView);