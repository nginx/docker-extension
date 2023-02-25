import {useEffect, useState} from "react";

interface ConfigurationUiProps {
    container: string
}
export function ConfigurationUi(props: ConfigurationUiProps) {

    const [state,setState] = useState()
    useEffect(() => {

    });

    return(<>{props.container}</>)
}