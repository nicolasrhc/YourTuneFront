import { Component, Fragment, ReactNode } from "react";
import { BrowserRouter, Route, Switch,  } from "react-router-dom";
import { SPHeader } from "../../components/header/sp-header.component";
import { LoginView } from "../login/login.view";
import { PruebaView } from "../prueba/prueba.view";

export class RouterView extends Component {
    render(): ReactNode {
        return (
            <BrowserRouter>
                <SPHeader />
                <Switch>
                    <Route path={"/login"} component={LoginView}/>
                    <Route path={"/view"} component={PruebaView}/>
                    <Route path={"/"}>
                        <Fragment>
                            <div>Home</div>
                        </Fragment>
                    </Route>
                </Switch>
            </BrowserRouter>
        )
    }
}