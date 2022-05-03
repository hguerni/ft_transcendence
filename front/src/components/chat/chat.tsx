import { RestaurantRounded } from "@mui/icons-material";
import { Button } from "@mui/material";

function ButtonCreateCanal(){

    const creatCanal = () => {

     }
 
     return (
         <>
             <div className="chat">
             <button onClick={creatCanal} className="button" name="button 1">
                 Button 1
              </button>
             </div>
         </>
     );
}

function Chat() {

    return (
        <>
            
         <ButtonCreateCanal/>
            
        </>
    );
}

export default Chat;