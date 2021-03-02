import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './index.css'


export default class EditorConvertToHTML extends Component {
    state = {
        editorState: EditorState.createEmpty(),
    }

    onEditorStateChange = (editorState) => {
        this.props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
        this.setState({ editorState });
    };

    onEmptyEditor = () => {
        this.setState({ editorState: EditorState.createEmpty() }, () => {
            this.props.getContent(draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())));
        });
    }

    componentDidMount() {
        const blocksFromHtml = htmlToDraft(this.props.content || '<p><p>');
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState = EditorState.createWithContent(contentState);
        this.setState({ editorState });
    }

    render() {
        const { editorState } = this.state;
        return (
            <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={this.onEditorStateChange}
            />
        );
    }
}