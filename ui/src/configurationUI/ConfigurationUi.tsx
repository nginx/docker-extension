import React, {useEffect, useState} from "react";
import {ConfigurationUiService} from "./ConfigurationUiService";
import {Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {Add, PlusOne} from "@mui/icons-material";

interface ConfigurationUiProps {
    container: string
}
export function ConfigurationUi(props: ConfigurationUiProps) {

    const [state,setState] = useState({configuration: {http: {servers: []}}})
    const configurationUiService: any = new ConfigurationUiService()

    useEffect(() => {
        const configuration = async () => {
            configurationUiService.getConfiguration(props.container).then((configuration: any) => {
                setState({configuration: configuration})
            })
        }
        configuration().catch(console.error)
    }, []);

    return(<TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Server</TableCell>
                        <TableCell align="right">Ports</TableCell>
                        <TableCell align="right">Locations</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {state.configuration.http.servers.map((server, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {server.names.join(',')}
                            </TableCell>
                            <TableCell align="right">
                                {server.listeners.map((listener, index) => (
                                    <Chip key={index} label={listener} variant="outlined" />
                                ))}
                            </TableCell>
                            <TableCell align="right">
                                {server.locations.map((location, index) => (
                                    //Does this makes sense? Ask community.
                                    <Chip key={index} label={location.location} variant="outlined" />
                                ))}
                                + (add new)
                            </TableCell>
                            <TableCell align="right">Edit, Delete</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>)
}