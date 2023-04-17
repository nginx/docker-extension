import {InstancesService} from "../instances/InstancesService";
import {ConfigurationParser} from "../configuration/ConfigurationParser";
import {ConfigurationCreator} from "../configuration/ConfigurationCreator";
import {Base64} from "js-base64";


export class ConfigurationUiService {

    private instanceService: InstancesService;
    private configurationParser: ConfigurationParser;
    private configurationCreator: ConfigurationCreator;

    constructor() {
        this.instanceService = new InstancesService();
        this.configurationParser = new ConfigurationParser();
        this.configurationCreator = new ConfigurationCreator();

    }

    async getConfiguration(containerId: string) {
        const config = await this.instanceService.getInstanceConfiguration(containerId);
        return this.configurationParser.parse(config);
    }

    createNewServerConfiguration(serverConfiguration: any, containerId: any) {
        console.log(serverConfiguration)
        let configTemplate = this.configurationCreator.simpleProxyConfiguration(serverConfiguration.serverName,
            serverConfiguration.listeners,
            serverConfiguration.upstream);
        console.log(configTemplate)
        const content = Base64.encode(configTemplate)
        this.instanceService.sendConfigurationToFile(serverConfiguration.file, containerId, content).then((data: any) => {
            this.instanceService.reloadNGINX(containerId).then((data: any) => {
                this.instanceService.displaySuccessMessage("Configuration successfully updated!");
            }).catch((reason: any) => {
                this.instanceService.displayErrorMessage(`Error while updating configuration: ${reason.stderr.split("\n")[1]}`);
            })
        })
        return configTemplate
    }
}