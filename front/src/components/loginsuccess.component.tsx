import {useEffect, useState} from "react";
import axios from "axios";
//import {User} from "../models/user.model";

const LoginSuccess = () => {
    const [unauthorized, setUnauthorized] = useState(false);
    const [user, setUser] = useState({
        username: '',
        img: '',
        email: '',
        id: 0,
        pendingInvite: false,
    });

    useEffect(() => {
        let mounted = true;

        const authorization = async () => {
            try { await axios.get('userData'); }
            catch(err){if(mounted) setUnauthorized(true);}
        }
        authorization();
        return () => {mounted = false;}
    }, []);

    useEffect(() => {
        let mounted = true;
        const getUser = async () => {
            try {
                const {data} = await axios.get('userData')
                if (mounted) setUser(data);
            }
            catch(err){if(mounted) setUnauthorized(true);}
        }
        getUser();
        return () => {mounted = false;}
    }, []);


    // if (unauthorized)
    //     return <Redirect to={'/'}/>;


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
    )
}

export default LoginSuccess
