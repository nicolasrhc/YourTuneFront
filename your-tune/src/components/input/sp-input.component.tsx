import { Input, InputProps } from "antd";
import { Component, ReactNode } from "react";
import { Undefinable } from "../../utils/undefinable";

interface SPInputProps<T> extends InputProps {
    className?: string;
    value: Undefinable<string | number>;
    name: string; //cambiar a keyof T
}

export class SPInput<T> extends Component<SPInputProps<T>> {
    render(): ReactNode {
        return (
            <Input
                {...this.props}
                className={this.props.className}
                value={this.props.value}
                name={this.props.name as string}
                allowClear
            />
        )
    }
}