import { Button } from "antd";
import { CSSProperties, Component, ReactNode } from "react";

interface SPButtonProps {
    className?: string;
    type?: "link" | "text" | "ghost" | "default" | "primary" | "dashed" | undefined;
    onClick: ((event: any) => void) | undefined;
    children: ReactNode;
    style?: CSSProperties;
    disabled?: boolean;
}

export class SPButton extends Component<SPButtonProps> {
    render(): ReactNode {
        return (
            <Button
                onClick={this.props.onClick}
                className={this.props.className}
                type={this.props.type}
                shape="round"
                style={this.props.style}
                disabled={this.props.disabled}
            >
                {this.props.children}
            </Button>
        )
    }
}