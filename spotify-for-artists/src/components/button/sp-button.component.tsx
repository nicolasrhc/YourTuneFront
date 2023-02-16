import { Button } from "antd";
import { Component, ReactNode } from "react";

interface SPButtonProps {
    className?: string;
    type?: "link" | "text" | "ghost" | "default" | "primary" | "dashed" | undefined;
    onClick: ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void) | undefined;
    children: ReactNode;
}

export class SPButton extends Component<SPButtonProps> {
    render(): ReactNode {
        return (
            <Button
                onClick={this.props.onClick}
                className={this.props.className}
                type={this.props.type}
            >
                {this.props.children}
            </Button>
        )
    }
}