import { $getRoot } from "lexical";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { $isHashtagNode, HashtagNode } from '@lexical/hashtag';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { useState } from "react";
import { POST_CONTENT_LENGTH } from "@odiano/shared";

type Props = {
    errorMessage: string | undefined | null,
    setContent: (content: string) => void,
    setHashtags: (hastags: string[] | null) => void,
}

const theme = {
    hashtag: "text-sky-500 font-semibold"
}

const initialConfig = {
    namespace: 'postContentEditor',
    nodes: [
        HashtagNode,
    ],
    theme,
    onError: () => { }
}


const PostContentEditor = ({ errorMessage, setContent, setHashtags }: Props) => {
    const [contentLength, setContentLength] = useState<number>(0);

    const changeHandler = (editorState: any) => {
        editorState.read(() => {
            const text = $getRoot().getTextContent();

            setContentLength(text.length);
            setContent(text);

            const hashtags = $getRoot().getAllTextNodes()
                .filter($isHashtagNode)
                .map((node: any) => node.getTextContent().slice(1).toLowerCase());
            setHashtags(hashtags);
        })
    }

    return (
        <>
            <LexicalComposer initialConfig={initialConfig}>
                <div className="relative">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className={`mt-4 w-full h-64 sm:h-40 border duration-100 rounded-xl py-4 px-5 default-input-text-behaviour ${errorMessage ? "border-red-500 text-red-500" : "border-neutral-600 text-neutral-300"}`}
                                aria-placeholder={'Enter some text...'}
                                placeholder={
                                    <div className="absolute top-5 left-5 text-neutral-500">
                                        What's on your mind?
                                    </div>
                                }
                            />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HashtagPlugin />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <OnChangePlugin onChange={changeHandler} />

                    <div className={`absolute bottom-3 right-3 text-sm ${contentLength > POST_CONTENT_LENGTH.MAX ? 'text-red-500' : 'text-neutral-100'}`}>
                        {contentLength}/{POST_CONTENT_LENGTH.MAX}
                    </div>
                </div>
            </LexicalComposer>
            {
                errorMessage &&
                <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
            }
        </>
    )
}

export default PostContentEditor;