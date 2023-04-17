import {ConfigurationTemplates} from "./ConfigurationTemplates";


export class ConfigurationCreator {

    public simpleProxyConfiguration(serverName: string, port: string, upstream: string) {
        let configurationString = ConfigurationTemplates.simpleProxyServerTemplate()
        configurationString = configurationString.replace(/\$\$LISTEN/g, port)
        configurationString = configurationString.replace(/\$\$SERVER_NAME/g, serverName)
        configurationString = configurationString.replace(/\$\$UPSTREAM/g, `http://${upstream}/`)
        return configurationString
    }
}