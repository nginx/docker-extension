import {useEffect, useState} from "react";
import {ConfigurationUiService} from "./ConfigurationUiService";

interface ConfigurationUiProps {
    container: string
}
export function ConfigurationUi(props: ConfigurationUiProps) {

    const [state,setState] = useState()
    const configurationUiService: any = new ConfigurationUiService()

    useEffect(() => {
        const configuration = async () => {
            configurationUiService.getConfiguration(props.container).then((configuration: any) => {
                console.log(configuration)
            })
        }
        configuration().catch(console.error)
    });

    return(<>{props.container}</>)
}