import { FormikProps, withFormik } from "formik";
import { Component, ReactNode } from "react";
import { SPPlaylist } from "../../api/api";
import { SPButton } from "../../components/button/sp-button.component";
import { Undefinable } from "../../utils/undefinable";
import { SPInput } from "../../components/input/sp-input.component";
import { RouteChildrenProps } from "react-router-dom";
import { Comment } from "@ant-design/compatible";

export type seleccionType = "genero" | "artista";

export interface FormNuevoPost {
    mensaje: Undefinable<string>;
}

export interface FormNuevoPostValidated extends FormNuevoPost {
    mensaje: string;
}

export interface PruebaFormOuterProps extends RouteChildrenProps {
    crearPost: (mensaje: string, idComunidad: string) => Promise<void>;
}

export interface NuevoPostFormState {
    playlists: Undefinable<SPPlaylist[]>;
}

export class _NuevoPostForm extends Component<FormikProps<FormNuevoPost>, NuevoPostFormState> {

    readonly state: NuevoPostFormState = {
        playlists: undefined,
    }

    render(): ReactNode {
        return (
            <Comment
                content={
                    <div>
                        <div className="m-2">
                            <SPInput<FormNuevoPost>
                                name="mensaje"
                                onChange={this.props.handleChange}
                                value={this.props.values.mensaje}
                            />
                        </div>
                        <div className="d-flex justify-content-end p-4 pb-0">
                            <SPButton
                                onClick={this.props.handleSubmit}
                                type={"primary"}
                            >
                                Crear
                            </SPButton>
                        </div>
                    </div>
                }
            />
        )
    }
}

export const NuevoPostForm = withFormik<PruebaFormOuterProps, FormNuevoPost>({
    handleSubmit: async (values: FormNuevoPost, { props, resetForm }) => {
        const valuesValidated: FormNuevoPostValidated = values as FormNuevoPostValidated;
        await props.crearPost(valuesValidated.mensaje, (props.match?.params as any).idComunidad);
        resetForm();
    },
    mapPropsToValues: () => ({
        mensaje: undefined,
    })
})(_NuevoPostForm);