import React, {MouseEventHandler, ReactComponentElement, useEffect, useState} from 'react';
import {InstancesService} from "./InstancesService";
import {
    Box,
    Button,
    Container,
    Grid,
    IconButton, Link,
    Paper, Tab,
    Tabs,
    TextareaAutosize,
    Tooltip,
    Typography
} from "@mui/material";
import Highlight, {defaultProps} from "prism-react-renderer"
import github from "prism-react-renderer/themes/github"
import styled from "@emotion/styled";
import "./Instance.css";
import SendAndArchiveOutlinedIcon from '@mui/icons-material/SendAndArchiveOutlined';
import {Unarchive, Archive, ArrowBackIosNewOutlined} from "@mui/icons-material";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';

import Editor from "react-simple-code-editor"
import {languages, highlight} from "prismjs";
import "./prism-nginx.css";
import "prismjs/components/prism-nginx.js";
import ReactDOM from "react-dom/client";
import {ConfigurationReference} from "../configuration/ConfigurationReference";
import {blue} from "@mui/material/colors";

interface NginxInstance {
    id: string,
    name: string
}

interface ErrorSate {
    message: string,
    undoVisible: boolean,
    errorBannerVisible: boolean
}

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

    //new State Object - old stuff has to be refactored!
    const [nginxInstance, setNginxInstance] = useState<NginxInstance>({id: "", name: ""})
    // Holds the "original" Configuration before modifying to be able to role-back in case of errors.
    const [oldConfiguration, setOldConfiguration] = useState<string>("");
    const [directiveInfo, setDirectiveInfo] = useState<any>({})

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
                            ports: inst.ports,
                            status: inst.status,
                            name: inst.name.replace("/", "")
                        })
                    }
                });
                setResponse(instancesArray)
                setLoading(false)
            });
        }

        instancePromise().catch(console.error)
    }, []);

    const nginxInstanceOnClickHandler: MouseEventHandler<HTMLLIElement> | any = (containerId: string, name: string) => (event: MouseEventHandler<HTMLLIElement>) => {
        instanceService.getConfigurations(containerId).then((data: any) => {
            //Config-Files into array!
            //@todo Refactoring: Make this more type save and check what
            // Typescript can do with undefined and null values
            let filesArray: Array<string> = data
            filesArray = filesArray.filter(item => item != "").map((item: string) => {
                let match = item.match('(?:\\/etc\\/nginx\\/.*)');
                if (match != undefined) {
                    return match[0].replace(`:`, ``)
                } else {
                    return ""
                }
            })
            setNginxInstance({id: containerId, name: name})
            setConfiguration(filesArray)
        })

    }

    const configurationFileOnClickHandler: any = (fileName: string) => (event: any) => {
        instanceService.getConfigurationFileContent(fileName, nginxInstance.id).then((data: any) => {
            setOldConfiguration(data.stdout)
            setCFContent(data.stdout);
            setFileName(fileName);

        }).catch((error: any) => console.error())

    }

    const saveConfigurationToFile: any = (file: string, containerId: string) => (event: any) => {
        //build dynamically from TextInput as B64.
        const content = btoa(configurationFileContent)
        instanceService.sendConfigurationToFile(file, containerId, content).then((data: any) => {
            //error handling here.
            instanceService.reloadNGINX(containerId).then((data: any) => {
                instanceService.displaySuccessMessage("Configuration successfully updated!");
            }).catch((reason: any) => {
                instanceService.displayErrorMessage("Error while updating configuration! Click Undo to revert.");
            })
        })
    }

    const onChangeConfigurationHandler: any = (event: any) => {
        setCFContent(event.currentTarget.value)
    }

    const undoChanges: any = () => {
        setCFContent(oldConfiguration)
    }

    const Pre = styled.pre`
      text-align: left;
      margin: 1em 0;
      padding: 0.5em;
      overflow: scroll;
    `;

    const Line = styled.div`
      display: table-row;
    `;

    const LineNo = styled.span`
      display: table-cell;
      text-align: right;
      padding-right: 1em;
      user-select: none;
      opacity: 0.5;
    `;

    const LineContent = styled.span`
      display: table-cell;
    `;


    const containerNetwork: any = (port: any) => {
        if (port.PrivatePort && port.PublicPort) {
            return (<Box paddingTop={2}>

                    <Tooltip title="Container Port">
                        <IconButton>
                            <Unarchive/>
                        </IconButton>
                    </Tooltip>
                    <span>{port.PrivatePort}</span>
                    <Tooltip title="Public Port">
                        <IconButton>
                            <Archive/>
                        </IconButton>
                    </Tooltip>
                    <span>{port.IP}:{port.PublicPort}</span>
                </Box>
            )
        }
        if (port.PrivatePort && !port.PublicPort) {
            return (<Box paddingTop={2}>
                    <Tooltip title="Container Port">
                        <IconButton>
                            <Unarchive/>
                        </IconButton>
                    </Tooltip>
                    <span>{port.PrivatePort}</span>
                    <Tooltip title="Port Not Exposed!">
                        <IconButton>
                            <Archive/>
                        </IconButton>
                    </Tooltip>
                    <span>-</span>
                </Box>
            )
        }
    }

    const registerListener: any = (event: any) => {
        [...document.querySelectorAll('.token.directive')].forEach((item: any) => {
            console.log(item);
            item.addEventListener('click', (event: any) => {
                console.log(event);
            })
        })
    }
    const configSpanOnClickHandler: any = (event: any) => {
        console.log(event.currentTarget.innerText.trim());
        const ccr = new ConfigurationReference();
        const dirInfo = ccr.getDirectiveInformation(event.currentTarget.innerText.trim());
        setDirectiveInfo(dirInfo)
        console.log(dirInfo);
    }
    // Refactor this! Make is smarter than a simple if in here!
    // IDEA: Parse the content of the configuration and display the help message form nginx.org :D DO IT!
    return (
        <>
            {!loading ? (
                !configuration ? (
                    <Grid container> {
                        instances.map((inst: any, key: number) => (
                            <Grid item sm={6} lg={4}>
                                <Box className={"ngx-instance"} borderRadius={1} boxShadow={5} margin={2} padding={2}
                                     border={"1px solid gray"}
                                     onClick={nginxInstanceOnClickHandler(inst.id, inst.name)}>
                                    <Typography variant="h3">{inst.name}</Typography>
                                    <Typography variant="subtitle1" paddingY={2}>{inst.status}</Typography>
                                    {inst.out}
                                    {inst.ports.map((port: any) => (
                                        <Box>
                                            {containerNetwork(port)}
                                        </Box>
                                    ))
                                    }
                                </Box>
                            </Grid>
                        ))}</Grid>) : (
                    <>
                        <Typography variant={"h3"} paddingTop={2} onClick={() => {
                            setConfiguration(undefined)
                            setContainerId(undefined)
                            setCFContent(undefined)
                            setFileName(undefined)
                            setNginxInstance({id: "", name: ""})
                        }}>
                            <Tooltip title="Back to Instances Overview">
                                <IconButton className={"ngx-back-button"}>
                                    <ArrowBackIosNewOutlined/>
                                </IconButton>
                            </Tooltip>
                            {nginxInstance.name}
                        </Typography>
                        <Typography variant={"subtitle2"}>
                            Id: {nginxInstance.id}
                        </Typography>
                        <Grid container marginY={2}>
                            <ul>
                                {configuration.map((file: string, index: number) => (
                                    <li onClick={configurationFileOnClickHandler(file)}>
                                        {file}
                                    </li>
                                ))
                                }
                            </ul>
                        </Grid>
                        {!configurationFileContent ? (
                            <Grid container>
                                <Grid item marginX={"auto"} marginY={10}>
                                    <Box>
                                        <Typography variant={"h2"}>
                                            <AnnouncementOutlinedIcon
                                                style={{color: "navy", marginRight: "1rem", fontSize: "larger"}}/>
                                            No Configuration File selected! Please select one.
                                        </Typography>
                                    </Box>

                                </Grid>
                            </Grid>
                        ) : (
                            <Grid container>
                                <Grid item sm={12}>
                                    <Typography variant={"h4"} marginY={2}>{fileName}</Typography>
                                    <Button variant={"outlined"} startIcon={<SendAndArchiveOutlinedIcon/>}
                                            onClick={saveConfigurationToFile(fileName, nginxInstance.id)}>Save
                                        changes!</Button>
                                </Grid>
                                <Grid item sm={12} lg={6} marginTop={2}>
                                    <Editor
                                        value={configurationFileContent}
                                        className={"nginx-config-editor"}
                                        onFocus={registerListener}
                                        onValueChange={configurationFileContent => setCFContent(configurationFileContent)}
                                        highlight={configurationFileContent => highlight(configurationFileContent, languages.nginx, "nginx")}
                                        padding={10}
                                        style={{
                                            fontFamily: '"Fira code", "Fira Mono", monospace',
                                            fontSize: 14,
                                        }}
                                    />
                                </Grid>
                                <Grid item sm={12} lg={6}>
                                    <Grid container>
                                        <Grid item sm={12} lg={8}>
                                            <Typography variant={"h3"}>Configuration Inspector</Typography>
                                            <Typography variant={"subtitle1"}>Learn more about the NGINX
                                                directives</Typography>
                                            <Highlight {...defaultProps} code={configurationFileContent}
                                                       language={"clike"} theme={github}>
                                                {({className, style, tokens, getLineProps, getTokenProps}) => (
                                                    <Pre className={className} style={style}>
                                                        {tokens.map((line, i) => (
                                                            <Line key={i} {...getLineProps({line, key: i})}>
                                                                <LineNo>{i + 1}</LineNo>
                                                                <LineContent>
                                                                    {line.map((token, key) => (
                                                                            <>
                                                                                <span onClick={configSpanOnClickHandler}
                                                                                      key={key} {...getTokenProps({
                                                                                    token,
                                                                                    key
                                                                                })} />
                                                                            </>
                                                                        )
                                                                    )}
                                                                </LineContent>
                                                            </Line>
                                                        ))}
                                                    </Pre>
                                                )}
                                            </Highlight>
                                        </Grid>
                                        <Grid item sm={12} lg={4} borderLeft={"0.2rem solid"} borderColor={blue.A200} paddingLeft={2}>
                                            {directiveInfo ?  (
                                                <>
                                                    <Typography variant={"h4"}>{directiveInfo.name}</Typography>
                                                    <Box>
                                                     Syntax:
                                                    <pre>{directiveInfo.syntax}</pre>
                                                    </Box>
                                                    <Box>
                                                        {directiveInfo.information}
                                                    </Box>

                                                </>
                                            ) : (<></>)}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </>
                )) : (<h1>Loading...</h1>)}
        </>
    );
}
