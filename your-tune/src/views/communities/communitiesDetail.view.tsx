import { Component, Fragment, ReactNode } from "react";
import { PruebaAPI } from "../../api/api";
import { Undefinable } from "../../utils/undefinable";
import { Modal } from "antd";
import { SPCommunity } from "./communities.view";
import { RouteChildrenProps } from "react-router-dom";
import { YTPost } from "../../components/post/post.component";
import { NuevoPostForm } from "./post.form";
import { SPButton } from "../../components/button/sp-button.component";

export interface SPPost {
    id: string;
    comments: SPPost[];
    content: string;
    user_name: string;
    user_url_image: string;
}

export type ComunidadesDetalleViewProps = RouteChildrenProps;

export interface ComunidadesDetalleViewState {
    posts: Undefinable<SPPost[]>;
    comunidad: Undefinable<SPCommunity>;
    isVisibleModalCrearPost: boolean;
    newPostId: string;
    userCommunities: Undefinable<string[]>;
}

export class ComunidadesDetalleView extends Component<ComunidadesDetalleViewProps, ComunidadesDetalleViewState> {
    readonly state: ComunidadesDetalleViewState = {
        posts: undefined,
        isVisibleModalCrearPost: false,
        comunidad: undefined,
        newPostId: "-1",
        userCommunities: undefined,
    }

    readonly columns = [
        {
            title: "Usuario",
            dataIndex: "user_name",
            key: "user_name",
        },
        {
            title: "Imagen",
            dataIndex: "user_image_url",
            key: "user_image_url",
        },
        {
            title: "Mensaje",
            dataIndex: "message",
            key: "message",
        },
    ];

    get isUserInCommunity(): boolean {
        return (this.state?.userCommunities && this.state?.comunidad) ? this.state.userCommunities.includes(this.state.comunidad._id) : false;
    }

    constructor (props: ComunidadesDetalleViewProps) {
        super (props);

        this.createPost = this.createPost.bind(this);
        this.handleCreatePost = this.handleCreatePost.bind(this);
        this.handleCreateFirstPost = this.handleCreateFirstPost.bind(this);
        this.followComunidad = this.followComunidad.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.unfollowComunidad = this.unfollowComunidad.bind(this);
    }

    async componentDidMount(): Promise<void> {
        await this.obtenerRecursosIniciales();
    }

    async obtenerRecursosIniciales(): Promise<void> {
        const idComunidad = (this.props.match?.params as any).idComunidad;
        await this.getCommunity(idComunidad);
        await this.getCommunityPosts(idComunidad);
        await this.getUserData();
    }

    async getUserData(): Promise<void> {
        const userData = await new PruebaAPI().obtenerUsuarioDDBB();
        this.setState({userCommunities: userData?.data.communities_ids})
    }

    async getCommunity (idComunidad: string): Promise<void> {
        try {
            const comunidadData = await new PruebaAPI().obtenerComunidadPorId(idComunidad);
            const comunidad = comunidadData?.data;
    
            this.setState({ comunidad })
        } catch (e) {
            console.log(e);
        }
    }

    async getCommunityPosts (idComunidad: string): Promise<void> {
        try {
            const postsData = await new PruebaAPI().obtenerPostsComunidad(idComunidad);
            const posts = postsData?.data;
    
            this.setState({ posts })
        } catch (e) {
            console.log(e);
        }
    }

    async createPost (mensaje: string, idComunidad: string): Promise<void> {
        try {
            await new PruebaAPI().crearPost(mensaje, idComunidad, this.state.newPostId);
            await this.getCommunityPosts(idComunidad);
            this.setState({
                newPostId: "-1",
                isVisibleModalCrearPost: false,
            });
        } catch (e) {
            console.log(e);
        }
    }

    handleCreatePost (postId: string): void {
        this.setState({
            isVisibleModalCrearPost: true,
            newPostId: postId,
        })
    }

    handleCreateFirstPost (): void {
        this.handleCreatePost("-1");
    }

    renderPosts(posts: SPPost[]): ReactNode {
        return posts.map(post => {
            return (
                <YTPost
                    post={post}
                    onCreatePost={this.handleCreatePost}
                    key={post.id}
                    disabledResponder={!this.isUserInCommunity}
                >
                    {this.renderPosts(post.comments)}
                </YTPost>
            )
        })
    }

    closeModal(): void {
        this.setState({isVisibleModalCrearPost: false});
    }

    async followComunidad(): Promise<void> {
        try {
            if (this.state.comunidad) {
                await new PruebaAPI().followComunidad(this.state.comunidad?._id);
                await this.obtenerRecursosIniciales();
            }
        } catch (e) {
            console.log(e);
        }
    }

    async unfollowComunidad(): Promise<void> {
        try {
            if (this.state.comunidad) {
                await new PruebaAPI().unfollowComunidad(this.state.comunidad?._id);
                await this.obtenerRecursosIniciales();
            }
        } catch (e) {
            console.log(e);
        }
    }

    render (): ReactNode {
        return (
            <Fragment>
                <div className="cancion-diaria">
                    <div className="row m-0">
                        <div className="col-10 m-0">
                            <div style={{ textOverflow: "ellipsis"}} className="nombre-artista-dashboard">{this.state.comunidad?.nombre}</div>
                        </div>
                        <div className="col-1">
                            <div>Seguidores</div>
                            <div>{this.state.comunidad?.num_usuarios}</div>
                        </div>
                    </div>
                    <div style={{marginLeft: "30px", marginBottom: "20px"}}>
                        {this.state.comunidad?.descripcion}
                    </div>
                    <div className="d-flex justify-content-end p-2">
                        {
                            this.isUserInCommunity && (
                                <SPButton
                                    onClick={this.unfollowComunidad}
                                    type={"primary"}
                                >
                                    Dejar de seguir
                                </SPButton>
                            )
                        }
                        {
                            !this.isUserInCommunity && (
                                <SPButton
                                    onClick={this.followComunidad}
                                    type={"primary"}
                                >
                                    Unirme
                                </SPButton>
                            )
                        }
                    </div>
                </div>
                <div className="p-4">
                    {
                        this.isUserInCommunity && (
                            <Fragment>
                                <div>Nuevo Mensaje</div>
                                <div style={{width: "50vw"}} className="mb-3">
                                    <NuevoPostForm
                                        crearPost={this.createPost}
                                        history={this.props.history}
                                        location={this.props.location}
                                        match={this.props.match}
                                    />
                                </div>
                            </Fragment>
                        )
                    }
                    <div style={{width: "50vw"}}>
                        {(!this.isUserInCommunity) && (
                            <div>
                                <div>Unete a la comunidad para poder interaccionar con los demas usuarios!</div>
                            </div>
                        )}
                        {(this.state.posts && this.state.posts?.length > 0) && this.renderPosts(this.state.posts)}
                        {(this.state.posts && this.state.posts?.length === 0 && this.isUserInCommunity) && (
                            <div>
                                <div>Todavia no hay nungún comentario, quieres ser el primero/a??</div>
                            </div>
                        )}
                    </div>
                    <Modal
                        open={this.state.isVisibleModalCrearPost}
                        onCancel={this.closeModal}
                        footer={null}
                    >
                        <NuevoPostForm
                            crearPost={this.createPost}
                            history={this.props.history}
                            location={this.props.location}
                            match={this.props.match}
                        />
                    </Modal>
                </div>
            </Fragment>
        );
    }
}