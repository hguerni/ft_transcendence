
import { SyntheticEvent, useEffect, useState } from "react";
import axios from 'axios';

import logo from '../images/ICON.svg';
import {Redirect} from "react-router-dom";


const TwoFa = () => {
    const [code, setCode] = useState(' ');
    const [loginFailure, setLoginFailure] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [unauthorized, setUnauthorized] = useState(false);

    useEffect(() => {
        let mounted = true;

        const authorization = async () => {
            try { await axios.get('userData'); }
            catch(err){if(mounted) setUnauthorized(true);}
        }
        authorization();
        return () => {mounted = false;}
    }, []);

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        try {
            await axios.post('2fa/login', { code: code,});
            setRedirect(true);
            setLoginFailure(false);
        }
        catch (err) {setLoginFailure(true);}
    }

    if (unauthorized)
        return <Redirect to={'/'}/>;

    if (redirect)
        return <Redirect to={'/profile'}/>

    return (
        <main >
            <form onSubmit={submit}>
                <img src={logo} alt="logo" width="72" height="57"/>
                <h1 >Please enter validation code</h1>

                {   loginFailure?
                    <p className="faSubTitle">Wrong validation code, please try again</p>
                    :
                    <p/>  }

                <div className="form-floating">
                    <input required className="form-control" id="floatingInput" placeholder="enter code here"
                           onChange={e => setCode(e.target.value)}/>
                    <label htmlFor="floatingInput">authentication code</label>
                </div>

                <button type="submit">Submit</button>
            </form>
        </main>
    )

}

export default TwoFa