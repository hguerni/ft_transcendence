import axios from 'axios';
import camera from '../../images/camera-solid.svg';
import './profile.css';


const Avatar = (props: {uploaded: (url: string) => void}) => {

    const upload = async (files: FileList | null ) => {
        if (files === null) return;

        const formData = new FormData();
        formData.append('image', files[0]);

        try {
            const {data} = await axios.post('upload', formData);
            await axios.put('updateAvatar', data.url);
            props.uploaded(data.url);
        }
        catch (err) {props.uploaded('http://localhost:3030/uploads/avatar.png')}

    }

    return (
        <div className="img-holder">
            <input className="btn" type="file" hidden onChange={e => upload(e.target.files)}> <img src={camera} alt="account" id="camera"/></input>
        </div>
    );

}

export default Avatar
