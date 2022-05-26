import {SyntheticEvent, useEffect, useState} from "react";
import { Redirect, useHistory } from "react-router-dom";
import axios from 'axios';
import './2fa.css';

import logo from '../../images/ICON.svg';


function ActivateTwoFa(){
    const [QRCode, setQRCode] = useState(' ');
    const [code, setCode] = useState(' ');
    const [redirect, setRedirect] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const [unauthorized, setUnauthorized] = useState(false);
    const history = useHistory();
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

        const getQRcode = async () => {
            try {
                const {data} = await axios.get('2fa/activate')
                if (mounted) setQRCode(data.url);
            }
            catch(err){if(mounted) setUnauthorized(true);}
        }
        getQRcode();
        return () => {mounted = false;}
    }, []);

    const activate = async (e: SyntheticEvent) => {
        e.preventDefault();

        try {
            await axios.post('2fa/verify', { code: code,} );
            setRedirect(true);
        }
        catch (err) { setInvalid(true); }
    }

    const disable = async (e: SyntheticEvent) => {
        e.preventDefault();

        await axios.post('2fa/disable', {});
        setRedirect(true);
    }

    if (unauthorized)
        return <Redirect to={'/'} />;

    if (redirect)
        history.push({pathname: "/profile", state: {activateTwoFa: false}});

    return (
        <main >
            <form className="trucPrincipal">
                <img src={logo}id="leLogo" alt="logo" width="72" height="57"/>
                <h1 id="leTitre">activate Two Factor authentication</h1>
                <h1 className="activateSubTitle">Scan this QR-code with the Google Authenticator app</h1>

                <div><img className="qrImg" alt="QRcode" src={QRCode}/></div>

                {   invalid?
                    <p className="faSubTitle">Wrong validation code, please try again</p>
                    :
                    <p/>  }

                <div className="form-floating">
                    <input required className="form-control" id="floatingInput" placeholder="Entrer le code"
                           onChange={e => setCode(e.target.value)}/>
                    <label htmlFor="floatingInput"></label>
                </div>

                <h1 className="activateText">User policy - Be aware that you need to scan this QR-code if you</h1>
                <h1 className="activateText">want to use this service OR continue using this service. Previously saved</h1>
                <h1 className="activateText">settings in the Google Authenticator app are expired and no longer valid.</h1>


                {/* <button onClick={activate} className="w-100 btn btn-lg btn-primary" type="button">activate</button>
                <button onClick={disable} className="w-100 btn btn-lg btn-primary" type="button">Disable</button> */}
            </form>
        </main>
    )

}

export default ActivateTwoFa
