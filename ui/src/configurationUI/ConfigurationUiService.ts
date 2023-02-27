import {InstancesService} from "../instances/InstancesService";
import {ConfigurationParser} from "../configuration/ConfigurationParser";


export class ConfigurationUiService {

    private instanceService: InstancesService;
    private configurationParser: ConfigurationParser;
    constructor() {
        this.instanceService = new InstancesService();
        this.configurationParser = new ConfigurationParser();
    }

    async getConfiguration(containerId: string) {
        const config = await this.instanceService.getInstanceConfiguration(containerId);
        return this.configurationParser.parse(config);
    }
}