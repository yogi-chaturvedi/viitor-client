import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import commonService from "../../services/common.service";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection:"column",
        width: 800,
        margin: "auto"
    },
    table: {
        margin: "auto"
    }
});

export default function Dashboard() {
    const classes = useStyles();

    const [patients, setPatients] = useState([]);

    useEffect(() => {
        commonService.getData("/patients")
            .then(res => {
                console.log(res);
                setPatients(res.data.data);
            })
    });

    return (
        <Paper className={classes.container}>
            <Toolbar>
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    Patient list
                </Typography>
            </Toolbar>
            <TableContainer>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Gender</TableCell>
                            <TableCell align="right">Age</TableCell>
                            <TableCell align="right">Diagnose With</TableCell>
                            <TableCell align="right">Address</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((row) => (
                            <TableRow key={row.name}>
                                <TableCell align="right">{`${row.firstName} ${row.lastName}`}</TableCell>
                                <TableCell align="right">{row.gender}</TableCell>
                                <TableCell align="right">{row.age}</TableCell>
                                <TableCell align="right">{row.diagnoseWith}</TableCell>
                                <TableCell align="right">{`${row.city}, ${row.state}, ${row.country}`}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
