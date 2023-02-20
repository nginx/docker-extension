import React, {MouseEventHandler, useEffect, useState} from 'react';
import {InstancesService} from "./InstancesService";
import {TextareaAutosize} from "@mui/material";

export function NginxInstance() {
    //Refactoring - Make the state more inclusive
    // - (merge ContainerId, ConfigurationFile and ConfigurationFileContent) in a single state property.
    //
    const [instances, setResponse] = useState<any>([]);
    const [containerId, setContainerId] = useState<any>(undefined);
    const [loading, setLoading] = useState<any>(true);
    const [configuration, setConfiguration] = useState<any>(undefined);

    const [configurationFileContent, setCFContent] = useState<any>("");

    const [fileName, setFileName] = useState<any>("");
    const instanceService: any = new InstancesService()

    useEffect(() => {
        const instancePromise = async () => {
            instanceService.getInstances().then((data: any) => {
                // add to the component\
                const instancesArray: Array<any> = []
                data.map(async (inst: any, index: number) => {
                    const container = await Promise.resolve(inst.promise).catch((error) => {
                    })
                    // Refactoring needed here!
                    if (container != undefined && !container.code) {
                        instancesArray.push({
                            id: inst.container,
                            out: container.stderr,
                            name: inst.name
                        })
                        setResponse([...instances, ...instancesArray])
                    }
                });
                setLoading(false)
            });
        }

        instancePromise().catch(console.error)
    }, []);

    const showConfigurationFiles: MouseEventHandler<HTMLLIElement> | any = (containerId: string) => (event: MouseEventHandler<HTMLLIElement>) => {
        setContainerId(containerId);
        instanceService.getConfigurations(containerId).then((data: any) => {
            //Config-Files into array!
            //@todo Refactoring: Make this more type save and check what
            // Typescript can do with undefined and null values
            let filesArray: Array<string> = data
            filesArray = filesArray.filter(item => item != "").map((item: string) => {
                let match = item.match( '(?:\\/etc\\/nginx\\/.*)');
                if (match != undefined) {
                    return match[0].replace(`:`,``)
                } else {
                    return ""
                }
            })
            setConfiguration(filesArray)
        })

    }

    const loadConfiguration: any = (fileName: string) => (event: any) => {
        console.log(containerId)
        instanceService.getConfigurationFileContent(fileName, containerId).then((data: any) => {
            console.log(data.stdout)
            setCFContent(data.stdout);
            setFileName(fileName);
        }).catch( (error: any) => console.error())
    }

    const saveConfigurationToFile: any = (file: string, containerId: string) => (event: any) => {
        //build dynamically from TextInput as B64.
        const content = btoa(configurationFileContent)
        instanceService.sendConfigurationToFile(file, containerId, content).then((data: any) => {
          //error handling here.
          instanceService.reloadNGINX(containerId).then((data: any) => {
              console.log(data)
            })
        })
    }

    const onChangeConfigurationHandler: any = (event: any) => {
        setCFContent(event.currentTarget.value)
    }

    // Refactor this! Make is smarter than a simple if in here!
    // IDEA: Parse the content of the configuration and display the help message form nginx.org :D DO IT!
    return (
        <>
            Nginx Instances
            {!loading ? (
                !configuration ? (
                    instances.map((inst: any, index: number) => (
                        <ul>
                            <li key={index} onClick={showConfigurationFiles(inst.id)}>
                                {inst.id}
                                {inst.name}
                                {inst.out}
                            </li>
                        </ul>
                    ))) : (
                    <>
                        <h3 onClick={() => {
                            setConfiguration(undefined)
                            setContainerId(undefined)
                            setCFContent(undefined)
                            setFileName(undefined)
                        }}>Go back</h3>
                        <h4>Found the following configuration files. Pick one.</h4>
                        <ul>
                            {configuration.map((file: string, index: number) => (
                                <li key={index} onClick={loadConfiguration(file)}>{file}</li>
                            ))
                            }
                        </ul>
                        {!configurationFileContent ? ("Please choose a file") : (
                            <>
                                <span onClick={saveConfigurationToFile(fileName, containerId)}>Save changes!</span>
                                <TextareaAutosize style={{width: '100%'}} value={configurationFileContent} onChange={onChangeConfigurationHandler}></TextareaAutosize>
                            </>
                        )}
                    </>
                )) : (<h1>Loading...</h1>)}
        </>
    );
}
