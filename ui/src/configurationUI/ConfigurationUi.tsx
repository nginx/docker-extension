import React, {useEffect, useState} from "react";
import {ConfigurationUiService} from "./ConfigurationUiService";
import {
    Box,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {Add, PlusOne} from "@mui/icons-material";

interface ConfigurationUiProps {
    containerId: string,
    nginxInstance: any
}

export function ConfigurationUi(props: ConfigurationUiProps) {

    const [state, setState] = useState({configuration: {http: {servers: []}}})
    const configurationUiService: any = new ConfigurationUiService()

    useEffect(() => {
        const configuration = async () => {
            configurationUiService.getConfiguration(props.containerId).then((configuration: any) => {
                setState({configuration: configuration})
            })
        }
        configuration().catch(console.error)
    }, []);

    const renderMountsIfAny: any = () => {
        console.log(props.nginxInstance);
        if (props.nginxInstance.mounts.length > 0) {
            return (
                <>
                    <Typography variant={"h3"}>Mounts</Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mount-Point</TableCell>
                                    <TableCell align="right">Type</TableCell>
                                    <TableCell align="right">Source</TableCell>
                                    <TableCell align="right">Destination</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.nginxInstance.mounts.map((mount: any, index: number) => (
                                    <TableRow
                                        key={index}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell component="th" scope="row">
                                            Test
                                        </TableCell>
                                        <TableCell align="right">
                                            {mount.Type}
                                        </TableCell>
                                        <TableCell align="right">
                                            {mount.Source}
                                        </TableCell>
                                        <TableCell align="right">
                                            {mount.Destination}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )
        }
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Server</TableCell>
                            <TableCell align="right">Ports</TableCell>
                            <TableCell align="right">Locations</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.configuration.http.servers.map((server: any, index: number) => (
                            <TableRow
                                key={index}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    {server.names.join(',')}
                                </TableCell>
                                <TableCell align="right">
                                    {server.listeners.map((listener: any, index: number) => (
                                        <Chip key={index} label={listener} variant="outlined"/>
                                    ))}
                                </TableCell>
                                <TableCell align="right">
                                    {server.locations.map((location: any, index: number) => (
                                        <Chip key={index} label={location.location} variant="outlined"/>
                                    ))}
                                    + (add new)
                                </TableCell>
                                <TableCell align="right">Edit, Delete</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box>
                {renderMountsIfAny()}
            </Box>
        </>
    )
}

