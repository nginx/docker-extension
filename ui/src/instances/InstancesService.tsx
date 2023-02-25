import {createDockerDesktopClient} from "@docker/extension-api-client"
import {ExecResult, DockerDesktopClient} from "@docker/extension-api-client-types/dist/v1";


/*
*  NGINX DD Instance Service
*
*  - find containers that run NGINX and add them to a list of instances.
*
*
*
* */

interface Port {
    PrivatePort: number,
    Type: string
}

interface Networks {

}

interface NetworkSettings {
    Networks: Networks
}

interface Container {
    Id: string,
    Names: Array<string>,
    Ports: Array<Port>,
    State: string,
    Status: string,
    NetworkSettings: any
}

/*
* class InstanceServices
* (C) F5 Inc. NGINX
* (C) Timo Stark <t.stark@f5.com>

* These are the main functions to communicate with a NGINX in a Docker Container.
*
*/

export class InstancesService {
    private ddClient: DockerDesktopClient

    constructor() {
        this.ddClient = createDockerDesktopClient();
    }

    async getInstances(): Promise<any> {
        //Cast the `unknown` Promise from the dd client to an actual array.
        //Create an interface object that can be returned by getInstances.
        //listContainers returns a Promises from Type Array<Container>

        const containers = await this.ddClient.docker.listContainers() as Array<Container>;

        //Loop over all containers and check if NGINX is installed.
        const promises = containers.map(container => {
            //Handling Promise in Map is tricky. So, using `Promise.all` seams the best solution here.
            //Other than that, the response from the docker exec command does not have any easy to parse
            //reference to the container anymore. So putting it in Context while creating the containers array
            //make sense.
            return {
                container: container.Id,
                name: container.Names[0],
                ports: container.Ports,
                status: container.Status,
                network: container.NetworkSettings.Networks,
                promise: this.ddClient.docker.cli.exec(
                    "exec",
                    ["-i", `${container.Id}`,
                        '/bin/sh -c "nginx -v"'])
            }
        })
        // Filtering out all Containers that are not NGINX.
        await Promise.all(promises.map(item => {
            return item.promise.then(result => {
                if (!result.code) {
                    return result
                }
                // Don't print error for rejected promises.
            }).catch((error) => '')
        }))
        return promises;
    }

    async getInstanceConfiguration(containerId: string): Promise<any> {
        const data = await this.ddClient.docker.cli.exec(
            "exec",
            [containerId,
                "/bin/sh", "-c", `"nginx -T"`]);
        // parse Configuration File and return array.
        return data.stdout
    }

    async getConfigurations(containerId: string): Promise<any> {
        const data = await this.ddClient.docker.cli.exec(
            "exec",
            [containerId,
                "/bin/sh", "-c", `"nginx -T"`]);
        // parse Configuration File and return array.
        return data.stdout.match(new RegExp('# configuration file(.*)', 'g'))
    }

    async getConfigurationFileContent(file: string, containerId: string): Promise<any> {
        const fileContent = await this.ddClient.docker.cli.exec(
            "exec",
            [containerId,
                "/bin/sh", "-c", `"cat ${file}"`]);
        console.log(fileContent);
        return fileContent;
    }

    // Maybe this can be the default function to send docker exec commands?
    async sendConfigurationToFile(file: string, containerId: string, configurationB64: string): Promise<any> {
        const ret = await this.ddClient.docker.cli.exec(
            "exec",
            [containerId,
                "/bin/sh", "-c", `"echo ${configurationB64} |base64 -d > ${file}"`]);
        // If code == 0, success, else error while applying new configuration.
        return ret
    }

    async reloadNGINX(containerId: string): Promise<any> {
        const ret = await this.ddClient.docker.cli.exec(
            "exec",
            [containerId,
                "/bin/sh", "-c", `"nginx -s reload"`]);
        return ret
    }

    parseConfigurationFiles(configuration: string): Array<string> {
        let filesToParse: Array<string> = []
        return filesToParse
    }

    displaySuccessMessage(message: string): void {
        this.ddClient.desktopUI.toast.success(message)
    }

    displayErrorMessage(message: string): void {
        this.ddClient.desktopUI.toast.error(message)
    }
}