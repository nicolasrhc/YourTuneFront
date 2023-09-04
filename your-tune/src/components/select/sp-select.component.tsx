import { Select, SelectProps } from "antd";
import { Component, ReactNode } from "react";
import { Undefinable } from "../../utils/undefinable";

interface SPSelectProps<T> extends SelectProps {
    className?: string;
    value: Undefinable<string | number>;
    name: string; //cambiar a keyof T
    onChange: (e: React.ChangeEvent<any>) => void;
}

export class SPSelect<T> extends Component<SPSelectProps<T>> {

    constructor (props: SPSelectProps<T>) {
        super (props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value: any): any {
        const evento: React.ChangeEvent<any> = {
            target: {
                value,
                name: this.props.name,
            }
        } as React.ChangeEvent<any>;
        this.props.onChange(evento);
    }

    render(): ReactNode {
        return (
            <Select
                {...this.props}
                className={this.props.className}
                onChange={this.handleChange}
                value={this.props.value}
            />
        )
    }
}