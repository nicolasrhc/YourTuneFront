import { Component, ReactNode } from "react";
import { BrowserRouter, Redirect, Route, Switch,  } from "react-router-dom";
import { LoginView } from "../login/login.view";
import { ReactCookieProps, withCookies } from "react-cookie";
import { DashboardView } from "../dashboard/dashboard.view";

export class _RouterView extends Component<ReactCookieProps> {
    get isLogged(): boolean {
        return !!this.props.cookies?.get("token");
    }

    get wantLog(): boolean {
        return !!this.props.cookies?.get("wantLog");
    }

    get isArtistSelected(): boolean {
        return !!this.props.cookies?.get("artist");
    }

    render(): ReactNode {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path={"/"}>
                        { () => {
                            return <Redirect to={"/login"}/>}
                        }
                    </Route>
                    <Route path={"/login"}>
                        { (props) => {
                            return !this.isLogged ? (<LoginView {...props} />) : (<Redirect to={"/dashboard/home"}/>)}
                        }
                    </Route>
                    <Route path={"/dashboard"}>
                        { (props) => {
                            return this.wantLog ? (<DashboardView {...props} />) : (<Redirect to={"/login"}/>)}
                        }
                    </Route>
                    {/* <Route path={"/daily-song"}>
                        { (props) => {
                            return this.isLogged ? (<DailySongView {...props} />) : (<Redirect to={"/login"}/>)}
                        }
                    </Route>
                    <Route path={"/playlists"}>
                        { (props) => {
                            return this.isLogged ? (<PlaylistsView {...props} />) : (<Redirect to={"/login"}/>)}
                        }
                    </Route> */}
                </Switch>
            </BrowserRouter>
        )
    }
}

export const RouterView = withCookies(_RouterView);