import { Button } from "antd";
import { Component, ReactNode } from "react";

interface SPButtonProps {
    className?: string;
    onClick: ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void) | undefined;
    children: ReactNode;
}

export class SPButton extends Component<SPButtonProps> {
    render(): ReactNode {
        return (
            <Button
                onClick={this.props.onClick}
                className={this.props.className}
            >
                {this.props.children}
            </Button>
        )
    }
}