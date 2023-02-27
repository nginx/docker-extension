import React, {MouseEventHandler, ReactComponentElement, useEffect, useState} from 'react';
import {InstancesService} from "./InstancesService";
import {
    Box,
    Button,
    Container, FormControl,
    Grid,
    IconButton, InputLabel, Link, MenuItem,
    Paper, Select, SelectChangeEvent, Tabs,
    Tooltip,
    Typography
} from "@mui/material";
import styled from "@emotion/styled";
import "./Instance.css";

import {Unarchive, Archive, ArrowBackIosNewOutlined, Folder, DriveFileMove} from "@mui/icons-material";

import Editor from "react-simple-code-editor"
import {languages, highlight, hooks} from "prismjs";
import "./prism-nginx.css";
import "../prism/prism-nginx.js";
import {ConfigurationReference} from "../configuration/ConfigurationReference";
import PublishIcon from '@mui/icons-material/Publish';
import DataObjectIcon from '@mui/icons-material/DataObject';
import UndoIcon from '@mui/icons-material/Undo';
import DnsIcon from '@mui/icons-material/Dns';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import {ConfigurationUi} from "../configurationUI/ConfigurationUi";

interface NginxInstances {
    id: string,
    name: string,
    mounts: Array<any>
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
    const [errorClasses, setErrorClasses] = useState<any>({
        bannerBackground: "nginx-banner-neutral",
        bannerErrorMessage: "",
        backToDashboardDisabled: false,
        undoChangesButtonDisabled: true,
    });

    //new State Object - old stuff has to be refactored!
    const [nginxInstance, setNginxInstance] = useState<NginxInstances>({id: "", name: "", mounts: []})
    // Holds the "original" Configuration before modifying to be able to role-back in case of errors.
    const [oldConfiguration, setOldConfiguration] = useState<string>("");

    const instanceService: any = new InstancesService()

    useEffect(() => {
        const instancePromise = async () => {
            instanceService.getInstances().then((data: any) => {
                const instancesArray: Array<any> = []
                data.map(async (inst: any, index: number) => {
                    const container = await Promise.resolve(inst.promise).catch((reason: any) => {
                    })
                    if (container != undefined && !container.code) {
                        instancesArray.push({
                            id: inst.container,
                            out: container.stderr,
                            ports: inst.ports,
                            mounts: inst.mounts,
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

            const mounts = instances.find(({id}: any) => id === containerId).mounts || []
            setNginxInstance({id: containerId, name: name, mounts: mounts })
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
                setErrorClasses({
                    bannerBackground: "nginx-banner-neutral",
                    backToDashboardDisabled: false,
                    undoChangesButtonDisabled: true,
                    bannerErrorMessage: ""
                });
            }).catch((reason: any) => {
                instanceService.displayErrorMessage(`Error while updating configuration: ${reason.stderr.split("\n")[1]}`);
                setErrorClasses({
                    bannerBackground: "nginx-banner-error",
                    backToDashboardDisabled: true,
                    undoChangesButtonDisabled: false,
                    bannerErrorMessage: `Error while updating configuration: ${reason.stderr.split("\n")[1]}`
                });
            })
        })
    }

    const undoChanges: any = () => {
        setCFContent(oldConfiguration)
        const content = btoa(oldConfiguration)
        instanceService.sendConfigurationToFile(fileName, nginxInstance.id, content).then((data: any) => {
            //error handling here.
            instanceService.reloadNGINX(nginxInstance.id).then((data: any) => {
                instanceService.displaySuccessMessage("Configuration rollback successful");
                setErrorClasses({
                    bannerBackground: "nginx-banner-neutral",
                    backToDashboardDisabled: false,
                    undoChangesButtonDisabled: true,
                    bannerErrorMessage: ""
                });
            }).catch((reason: any) => {
                instanceService.displayErrorMessage("Error while rolling back configuration! Contact Support!");
                setErrorClasses({
                    bannerBackground: "nginx-banner-error",
                    backToDashboardDisabled: true,
                    undoChangesButtonDisabled: false,
                    bannerErrorMessage: `Error while updating configuration: ${reason.stderr.split("\n")[1]}`
                });
            })
        })
    }
    //Refactoring! Move this into a seperate component
    const [tabValue, setTabValue] = useState('1');
    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

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

    /*
    * Render the Mount-Points of a given Container
    * */
    const containerMount: any = (mounts: any) => {
        if (mounts.length >= 1) {
            return (<Box>
                <IconButton>
                    <DriveFileMove/>
                </IconButton>
                Volumes mounted: {mounts.length}
            </Box>)
        } else {
            return ""
        }
    }

    const [configFile, setCF] = useState("")

    const nginxConfigurationFileOnChangeHandler = (event: SelectChangeEvent) => {
        setCF(event.target.value as string);
        setFileName(event.target.value as string);
        instanceService.getConfigurationFileContent(event.target.value as string, nginxInstance.id).then((data: any) => {
            setOldConfiguration(data.stdout)
            setCFContent(data.stdout);
        }).catch((error: any) => console.error())
    };

    const renderErrorMessageIfAny = () => {
        if (errorClasses.undoChangesButtonDisabled === false) {
            return (
                <Typography variant={"subtitle1"} paddingLeft={5} paddingBottom={2}>
                    {errorClasses.bannerErrorMessage}. Click "Undo Changes"!
                </Typography>
            )
        }
    }
    // Refactor this! Make is smarter than a simple if in here!
    // IDEA: Parse the content of the configuration and display the help message form nginx.org :D DO IT!
    return (
        <Container sx={{m: 1}}>
            {!loading ? (
                !configuration ? (
                    <Grid container> {
                        instances.map((inst: any, key: number) => (
                            //Refactoring Component Instance
                            <Grid item sm={6} lg={4} key={key}>
                                <Box className={"ngx-instance"} borderRadius={1} boxShadow={5} margin={2} padding={2}
                                     border={"1px solid gray"}
                                     onClick={nginxInstanceOnClickHandler(inst.id, inst.name)}>
                                    <Typography variant="h3">{inst.name}</Typography>
                                    <Typography variant="subtitle1" paddingY={2}>{inst.status}</Typography>
                                    {inst.out}
                                    {inst.ports.map((port: any, key: number) => (
                                        <Box key={key}>
                                            {containerNetwork(port)}
                                        </Box>
                                    ))
                                    }
                                    {containerMount(inst.mounts)}
                                </Box>
                            </Grid>
                        ))}</Grid>) : (
                    <Container>
                        <Grid className={errorClasses.bannerBackground}>
                            <Typography variant={"h3"} paddingTop={2}>
                                <Tooltip title="Back to Instances Overview">
                                    <IconButton className={"ngx-back-button"} onClick={() => {
                                        setConfiguration(undefined)
                                        setContainerId(undefined)
                                        setCFContent(undefined)
                                        setFileName(undefined)
                                        setNginxInstance({id: "", name: "", mounts: [] })
                                        setCF("")
                                    }} disabled={errorClasses.backToDashboardDisabled}>
                                        <ArrowBackIosNewOutlined/>
                                    </IconButton>
                                </Tooltip>
                                {nginxInstance.name}
                            </Typography>
                            <Typography variant={"inherit"} paddingLeft={5} paddingBottom={2}>
                                Container-ID: {nginxInstance.id}
                            </Typography>
                            {renderErrorMessageIfAny()}
                        </Grid>

                        <TabContext value={tabValue}>
                            <Box>
                                <Tabs value={tabValue} onChange={handleTabChange} aria-label="icon label tabs example">
                                    <Tab icon={<DnsIcon/>} label="Servers" value={"1"}/>
                                    <Tab icon={<BorderColorIcon/>} label="Configuration Editor" value={"2"}/>
                                </Tabs>
                            </Box>
                            <TabPanel value={"1"}>
                                <ConfigurationUi containerId={nginxInstance.id} nginxInstance={nginxInstance} />
                            </TabPanel>
                            <TabPanel value={"2"}>
                                <Grid container marginY={2}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Configuration File</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={configFile}
                                            label="Configuration File"
                                            placeholder={"Select Configuration File"}
                                            onChange={nginxConfigurationFileOnChangeHandler}>
                                            {configuration.map((file: string, index: number) => (
                                                <MenuItem value={file} key={index}>{file}</MenuItem>
                                            ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {!configurationFileContent ? (
                                    <Grid container>
                                        <Grid item marginX={"auto"} marginY={10}>
                                            <Box display={"flex"} alignItems={"center"}>
                                                <DataObjectIcon style={{marginRight: "1rem", fontSize: "4rem"}}/>
                                                <Typography variant={"h2"}>
                                                    No Configuration File selected! Please select one.
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Grid container>
                                        <Grid item sm={12}>
                                            <Typography variant={"h4"} marginY={2}>{fileName}</Typography>
                                            <Button variant={"outlined"} startIcon={<PublishIcon/>}
                                                    onClick={saveConfigurationToFile(fileName, nginxInstance.id)}>Publish</Button>
                                            <Button variant={"outlined"} startIcon={<UndoIcon/>}
                                                    onClick={undoChanges}
                                                    color={"error"}
                                                    style={{marginLeft: "0.5rem"}}
                                                    disabled={errorClasses.undoChangesButtonDisabled}
                                            >Undo Changes</Button>
                                        </Grid>
                                        <Grid item sm={12} lg={12} marginTop={2}>
                                            <Typography variant={"h3"}>Configuration Editor</Typography>
                                            <Editor
                                                value={configurationFileContent}
                                                className={"nginx-config-editor"}
                                                onValueChange={configurationFileContent => setCFContent(configurationFileContent)}
                                                highlight={
                                                    configurationFileContent => highlight(configurationFileContent, languages.nginx, "nginx")
                                                        .split("\n")
                                                        .map((line, i) => `<span class='editorLineNumber' key=${i}>${i + 1}</span>${line}`)
                                                        .join('\n')
                                                }
                                                padding={10}
                                                style={{
                                                    fontFamily: '"Fira code", "Fira Mono", monospace',
                                                    fontSize: 14,
                                                    outline: 0
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                )}
                            </TabPanel>
                        </TabContext>
                    </Container>
                )
            ) : (<Typography variant='h3'>Loading...</Typography>)}
        </Container>
    );
}
