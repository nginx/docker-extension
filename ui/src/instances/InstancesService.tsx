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

/* CONTAINER type.
{
    "Id": "cdd8e9aaba7855a8dd365bddcc675ca37bd09a09eab4979c0d0f1f1e9511bc37",
    "Names": [
    "/keen_hermann"
],
    "Image": "nginx",
    "ImageID": "sha256:3f8a00f137a0d2c8a2163a09901e28e2471999fde4efc2f9570b91f1c30acf94",
    "Command": "/docker-entrypoint.sh nginx -g 'daemon off;'",
    "Created": 1676375369,
    "Ports": [
    {
        "PrivatePort": 80,
        "Type": "tcp"
    }
],
    "Labels": {
    "maintainer": "NGINX Docker Maintainers <docker-maint@nginx.com>"
},
    "State": "running",
    "Status": "Up 6 hours",
    "HostConfig": {
    "NetworkMode": "default"
},
    "NetworkSettings": {
    "Networks": {
        "bridge": {
            "IPAMConfig": null,
                "Links": null,
                "Aliases": null,
                "NetworkID": "c641427fed6ccf5e375fec0fa4e679b7aebb0be54cb295ee3dae6e815b60a051",
                "EndpointID": "ca4d1778a7ae9aafc681a6b823146786b5131df9da84c85b43e4d2cdab4d1a49",
                "Gateway": "172.17.0.1",
                "IPAddress": "172.17.0.7",
                "IPPrefixLen": 16,
                "IPv6Gateway": "",
                "GlobalIPv6Address": "",
                "GlobalIPv6PrefixLen": 0,
                "MacAddress": "02:42:ac:11:00:07",
                "DriverOpts": null
        }
    }
},
    "Mounts": []
}
*/

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


export class InstancesService {
    private ddClient: DockerDesktopClient

    constructor() {
        this.ddClient = createDockerDesktopClient();
    }

    async getInstances(): Promise<any> {
        //Cast the `unknown` Promise from the dd client to an actual array.
        //Create an interface object that can be returned by getInstances.

        const containers = await this.ddClient.docker.listContainers() as Array<Container>;
        const promises = containers.map(container => {
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

    async getConfiguration(containerId: string): Promise<any> {
        const data = await this.ddClient.docker.cli.exec(
            "exec",
            [containerId,
                "/bin/bash", "-c", `'nginx -T |grep "# configuration file" | tr -d "\\n"'`]);
        // parse Configuration File and return array.
        return data;
    }

    async getConfigurationFileContent(file: string, containerId: string): Promise<any> {
        const fileContent = await this.ddClient.docker.cli.exec(
            "exec",
            [containerId,
                "/bin/sh", "-c", `'cat "${file}"'`]);
        return fileContent;
    }

    // Maybe this can be the default function to send docker exec commands?
    async sendConfigurationToFile(file: string, containerId: string, configurationB64: string): Promise<any> {
        const ret = await this.ddClient.docker.cli.exec(
            "exec",
            [containerId,
                "/bin/sh", "-c", `'echo ${configurationB64} |base64 -d > ${file}'`]);
        return ret
    }

    parseConfigurationFiles(configuration: string): Array<string> {
        let filesToParse: Array<string> = []
        return filesToParse
    }
}