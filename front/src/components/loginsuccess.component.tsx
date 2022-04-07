import React, {useEffect, useState} from "react";
import {Link, Navigate} from "react-router-dom"
import axios from "axios";
import {User} from "../models/user.model";

const LoginSuccess = () => {


    if (unauthorized)
        return <Navigate to={'/'}/>;


    return (
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6 ">
                        <table>
                            <tbody>
                                    <td><img src={`${user.img}`}  alt=""/></td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                            </tbody>
                        </table>
                </div>
                <div className="col-md-3"></div>
            </div>
}

export default LoginSuccess