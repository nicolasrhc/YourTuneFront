import { Select, SelectProps } from "antd";
import { Component, ReactNode } from "react";
import { Undefinable } from "../../utils/undefinable";

export interface SPSearchInputProps<T, U> extends SelectProps {
    name: keyof T;
    valueKey: keyof U;
    onSearch: (searchValue: string) => Promise<Undefinable<U[]>>;
    onChange: (e: React.ChangeEvent<any>) => void;
    onSetLabel: (opcion: U) => ReactNode;
}

export interface SPSearchInputState<U> {
    data: Undefinable<U[]>;
}

export class SPSearchInput<T,U> extends Component<SPSearchInputProps<T, U>, SPSearchInputState<U>> {

    readonly state: SPSearchInputState<U> = {
        data: undefined,
    }

    constructor (props: SPSearchInputProps<T, U>) {
        super (props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSetOptions = this.handleSetOptions.bind(this);
    }

    async handleSetOptions(searchValue: string): Promise<void> {
        const data = await this.props.onSearch(searchValue);

        this.setState({ data });
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
                showSearch
                defaultActiveFirstOption={false}
                value={this.props.value}
                showArrow={false}
                filterOption={false}
                onSearch={this.handleSetOptions}
                onChange={this.handleChange}
                notFoundContent={null}
                optionLabelProp="label"
                allowClear
                style={{
                    width: 200,
                    ...this.props.style
                }}
                options={(this.state.data || []).map((opcion) => ({
                    value: opcion[this.props.valueKey],
                    key: opcion[this.props.valueKey],
                    label: this.props.onSetLabel(opcion),
                }))}
            />
        )
    }
}