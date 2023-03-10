import React, {MouseEventHandler, useEffect, useState} from 'react';
import {InstancesService} from "./InstancesService";
import {
    Box,
    Container,
    Grid,
    IconButton,
    Tab,
    Tabs,
    Tooltip,
    ThemeProvider,
    Typography,
    createTheme
} from "@mui/material";
import styled from "@emotion/styled";
import "./Instance.css";

import {
    ArrowBackIosNewOutlined,
    Store
} from "@mui/icons-material";

import DnsIcon from '@mui/icons-material/Dns';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import {ConfigurationUi} from "../configurationUI/ConfigurationUi";
import {ConfigurationEditor} from "../configurationEditor/ConfigurationEditor";
import {TemplateStore} from "../templateStore/TemplateStore";


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

    const [errorClasses, setErrorClasses] = useState<any>({
        bannerBackground: "nginx-banner-neutral",
        bannerErrorMessage: "",
        backToDashboardDisabled: false,
        undoChangesButtonDisabled: true
    });

    //new State Object - old stuff has to be refactored!
    const [nginxInstance, setNginxInstance] = useState<NginxInstances>({id: "", name: "", mounts: []})
    // Holds the "original" Configuration before modifying to be able to role-back in case of errors.

    const instanceService: InstancesService = new InstancesService()

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
            const mounts = instances.find(({id}: any) => id === containerId).mounts || []
            setNginxInstance({id: containerId, name: name, mounts: mounts})
        })
    }


    //Refactoring! Move this into a separate component
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

    const listTheme = createTheme({
        typography: {
            h3: {
                fontSize: 30,
            },
            subtitle2: {
                fontSize: 13,
                opacity: .6,
                overflow: 'hidden',
            },
            body1: {
                fontWeight: 400,
            },
            body2: {
                fontWeight: 600,
            },
        },
    });

    const containerNetwork: any = (port: any, key: number) => {
        if (port.PrivatePort && port.PublicPort) {
            return (
                <Tooltip title={`${port.IP}:${port.PublicPort}:${port.PrivatePort}`} key={key}>
                    <Typography variant="body1" display="inline">{port.PublicPort}:{port.PrivatePort} </Typography>
                </Tooltip>
            )
        }
        if (port.PrivatePort && !port.PublicPort) {
            return (
                <Tooltip title={port.PrivatePort} key={key}>
                    <Typography variant="body1" display="inline">unbound:{port.PrivatePort} </Typography>
                </Tooltip>
            )
        }
    }

    const renderErrorMessageIfAny = () => {
        if (errorClasses.undoChangesButtonDisabled === false) {
            return (
                <Typography variant={"subtitle1"} paddingLeft={5} paddingBottom={2}>
                    {errorClasses.bannerErrorMessage}. Click "Undo Changes"!
                </Typography>
            )
        }
    }

    return (
        <Box sx={{m: 1}}>
            <ThemeProvider theme={listTheme}>
                {!loading ? (
                    !nginxInstance.id ? (
                            <Box>
                                <Typography variant="subtitle2">Active containers running NGINX</Typography>
                                <Grid container> {
                                    instances.map((inst: any, key: number) => (
                                        //Refactoring Component Instance
                                        <Grid item sm={6} lg={4} key={key}>
                                            <Box className={"ngx-instance"} borderRadius={1} boxShadow={10} margin={2}
                                                padding={2}
                                                background-color={"red"}
                                                border={"1px solid rgba(255,255,255,.2)"}
                                                onClick={nginxInstanceOnClickHandler(inst.id, inst.name)}>
                                                <Typography variant="h5">{inst.name}</Typography>
                                                <Typography variant="subtitle2" display="inline">Container ID: </Typography>
                                                <Typography variant="body1" display="inline">{inst.id.substring(0, 8)}...</Typography>
                                                <Box paddingTop={1}>
                                                    <Typography variant="subtitle2" display="inline">Status: </Typography>
                                                    <Typography variant="body1" display="inline">{inst.status.toLowerCase()}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle2" display="inline">NGINX Version: </Typography>
                                                    <Typography variant="body1" display="inline">{inst.out.substring(15, inst.out.length)}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle2" display="inline">Open Ports (Host:Container): </Typography>
                                                    {inst.ports.map((port: any, key: number) => containerNetwork(port, key))}
                                                </Box>
                                                {inst.mounts.length > 0 ? (
                                                    <Box>
                                                        <Typography variant="subtitle2" display="inline">Number of Mounted Volumes: </Typography>
                                                        <Typography variant="body1" display="inline">{inst.mounts.length}</Typography>
                                                    </Box>
                                                ) : ("")}
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        ) : (
                        <Box>
                            <Grid className={errorClasses.bannerBackground}>
                                <Typography variant={"h3"} paddingTop={2}>
                                    <Tooltip title="Back to Instances Overview">
                                        <IconButton className={"ngx-back-button"} onClick={() => {
                                            setContainerId(undefined)
                                            setNginxInstance({id: "", name: "", mounts: []})
                                        }} disabled={errorClasses.backToDashboardDisabled}>
                                            <ArrowBackIosNewOutlined/>
                                        </IconButton>
                                    </Tooltip>
                                    <Typography variant="h5" display="inline">{nginxInstance.name}</Typography>
                                </Typography>
                                <Typography variant={"inherit"} paddingLeft={5} paddingBottom={2}>
                                    Container ID: {nginxInstance.id.substring(0, 8)}...
                                </Typography>
                                {renderErrorMessageIfAny()}
                            </Grid>

                            <TabContext value={tabValue}>
                                <Box>
                                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="icon label tabs example">
                                        <Tab icon={<DnsIcon/>} label="Servers" value={"1"}/>
                                        <Tab icon={<BorderColorIcon/>} label="Configuration Editor" value={"2"}/>
                                        <Tab icon={<Store />} label="Templates Store" value={"3"}/>
                                        {/*<Tab icon={<FileDownload/>} label="Export Configuration" value={"4"}/>*/}
                                    </Tabs>
                                </Box>
                                <TabPanel value={"1"}>
                                    <ConfigurationUi containerId={nginxInstance.id} nginxInstance={nginxInstance}/>
                                </TabPanel>
                                <TabPanel value={"2"}>
                                    <ConfigurationEditor nginxInstance={nginxInstance}/>
                                </TabPanel>
                                <TabPanel value={"3"}>
                                    <TemplateStore />
                                </TabPanel>
                                <TabPanel value={"4"}>
                                    <>Exports</>
                                </TabPanel>
                            </TabContext>
                        </Box>
                    )
                ) : (<Typography variant='h3'>Loading...</Typography>)}
            </ThemeProvider>
        </Box>
    );
}
