import {highlight, languages} from "prismjs";
import React, {useState} from "react";
import ReactEditor from "react-simple-code-editor";
import "./prism-nginx.css";
import "./prism-nginx.js";

// This component makes use of Reacts Lifting State Up functionality. Read more about it
// here: https://reactjs.org/docs/lifting-state-up.html

interface EditorProps {
    setConfigurationFileContent: any
    fileContent: any
    style?: any | undefined
}


export function Editor(props: EditorProps) {
    const handleChange = (value: string) => {
        props.setConfigurationFileContent(value)
    }

    const placeholderText = "# ********************************************\n# NGINX Configuration Editor \n# Please write your configuration here\n# Feel free to remove this comment\n# ********************************************"

    return (
        <ReactEditor
            value={props.fileContent ? props.fileContent : placeholderText}
            className={"nginx-config-editor"}
            onValueChange={handleChange}
            highlight={
                configurationFileContent => highlight(props.fileContent ? props.fileContent : placeholderText, languages.nginx, "bash")
                    .split("\n")
                    .map((line, i) => `<span class='editorLineNumber' key=${i}>${i + 1}</span>${line}`)
                    .join('\n')
            }
            padding={10}
            style={{
                ...props.style,
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                whiteSpace: "pre",
                outline: 0,
            }}
        />
    )
}