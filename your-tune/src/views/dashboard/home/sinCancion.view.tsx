import { PlusSquareOutlined } from "@ant-design/icons";
import { Component, ReactNode } from "react";
import { RouteChildrenProps } from "react-router-dom";

export type SinCancionViewProps = RouteChildrenProps;

export class SinCancionView extends Component<SinCancionViewProps> {

    constructor (props: SinCancionViewProps) {
        super (props);

        this.goToDailySong = this.goToDailySong.bind(this);
    }

    goToDailySong(): void {
        this.props.history.push("/dashboard/daily-song");
    }

    render(): ReactNode {
        return (
            <div className="row m-0">
                <div className="col-9" style={{paddingTop: "4vh"}}>
                    Descubre tu cancion de hoy
                </div>
                <div className="col-3">
                    <PlusSquareOutlined style={{fontSize: "90px", cursor: "pointer"}} onClick={this.goToDailySong} rev={{}}/>
                </div>
            </div>
        );
    }
}