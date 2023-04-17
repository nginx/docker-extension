import {DockerDesktopClient} from "@docker/extension-api-client-types/dist/v1";
import {createDockerDesktopClient} from "@docker/extension-api-client";


export class NetworkService {

    private ddClient: DockerDesktopClient

    constructor() {
        this.ddClient = createDockerDesktopClient();
    }

// Network-Overview.
// Creates an array of the docker networks and the containers attached to them
// Returns a List of Containers and Exposed Ports internally as well as globally if defined.
    async containersInNetwork(network: string): Promise<any> {
        return await this.ddClient.docker.listContainers({"filters": JSON.stringify({network: [network]})});
    }

}