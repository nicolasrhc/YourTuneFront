import { Component, ReactNode } from "react";
import { SPPost } from "../../views/communities/communitiesDetail.view";
import { Avatar } from 'antd';
import { Comment } from "@ant-design/compatible";

export interface YTPostProps {
    post: SPPost;
    children?: ReactNode;
    onCreatePost: (postId: string) => void;
    disabledResponder: boolean;
}

export class YTPost extends Component<YTPostProps> {

    constructor (props: YTPostProps) {
        super (props);

        this.handleCreatePost = this.handleCreatePost.bind(this);
    }

    handleCreatePost(): void {
        this.props.onCreatePost(this.props.post.id);
    }

    render(): ReactNode {
        return (
            <Comment
                content={this.props.post.content}
                avatar={<Avatar src={this.props.post.user_url_image} alt={this.props.post.user_name} />}
                author={<a>{this.props.post.user_name}</a>}
                actions={this.props.disabledResponder ? [] : [<span key="comment-nested-reply-to" onClick={this.handleCreatePost}>Responder</span>]}
            >
                {this.props.children}
            </Comment>
        )
    }
}