import { Component, ReactNode } from "react";

export class SPHeader extends Component {
    render(): ReactNode {
        return (
            <nav>
                <div className="header row d-flex align-items-center">
                    <div className="col-2">Spotify For Artists</div>
                    <div className={"offset-9 col-1 boton-header"}>
                        Login
                    </div>
                </div>
            </nav>
        )
    }
}