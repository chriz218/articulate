import React, {useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import '../../CSSFiles/HomePage.css';

function HomePage({ socket, setIsHost, socketId, setSocketId }) {
    let history = useHistory();

    /** Request for a SocketId from server*/
    useEffect(() => {
        socket.emit('getSocketId', {}, (error) => {
            if(error) alert(error);
        });
    }, []);

    /** Response from server containing the socketId*/
    useEffect(() => {
        socket.on("socketId", ({ socketId }, error) => {
            if(error) alert(error);
            console.log("Registered SocketId: ", socketId);
            setSocketId(socketId);
        })
    });

    const handleCreateRoom = () => {
        if (socketId) {
            setIsHost(true);
            history.push("/create");
        }
    };

    const handleJoinRoom = () => {
        if (socketId) {
            setIsHost(false);
            history.push("/join");
        }
    };

    return (
        <div>
            <h1 className="ArticulateTitle">Articulate</h1>
            <h2 id="RuleTitle">Rules</h2>
            <div id="Description">
                Describe the generated word(s) for your teammates to guess. You cannot spell or rhyme the word, nor can you say the word or parts of the word. Each teammate will take turns being the describer and guesser. Each word guessed correctly moves your board piece by 1 position. Move your board piece to the end position to win. The color of the box where your board piece is on determines the word category.
            </div>
            <div className="Squares" style={{ backgroundColor: 'cyan' }} />
            <div className="ColorDescription">Object (e.g., tool box, pool table)</div>
            <div className="Squares" style={{ backgroundColor: '#FF7B00' }} />
            <div className="ColorDescription">Action (e.g., singing, driving)</div>
            <div className="Squares" style={{ backgroundColor: 'green' }} />
            <div className="ColorDescription">Nature (e.g., tulip, rose)</div>
            <div className="Squares" style={{ backgroundColor: 'blue' }} />
            <div className="ColorDescription">World (e.g., The Louvre, Senegal)</div>
            <div className="Squares" style={{ backgroundColor: 'yellow' }} />
            <div className="ColorDescription">Person (e.g., Peter Griffin, Cain)</div>
            <div className="Squares" style={{ backgroundColor: 'red' }} />
            <div className="ColorDescription">Random (e.g., chapter, wedge)</div>
            <div className="Squares" style={{ backgroundColor: 'grey' }} />
            <div className="ColorDescription">Everything (All categories)</div>
            <div id="HomeBtnsDiv">
                <button className="HomeBtns" onClick={handleCreateRoom}>Create Room</button>
                <button className="HomeBtns" onClick={handleJoinRoom}>Join Room</button>
            </div>
            <p id="Connection">Connected: { socketId ? 'YES' : 'NO' }</p>
        </div>
    );

}

export default HomePage