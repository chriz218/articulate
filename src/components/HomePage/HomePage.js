import React, {useEffect} from 'react';
import '../../CSSFiles/HomePage.css';

function HomePage({setPage, socket, setIsHost, socketId, setSocketId}) {

    /** Request for a SocketId from server*/
    useEffect(() => {
        socket.emit('getSocketId', {}, (error) => {
            if (error) alert(error);
        });
    }, []);

    /** Response from server containing the socketId*/
    useEffect(() => {
        socket.on('socketId', ({socketId}, error) => {
            if (error) alert(error);
            console.log('Registered SocketId: ', socketId);
            setSocketId(socketId);
        });
    });

    const handleCreateRoom = () => {
        if (socketId) {
            setIsHost(true);
            setPage('create');
        }
    };

    const handleJoinRoom = () => {
        if (socketId) {
            setIsHost(false);
            setPage('join');
        }
    };

    return (
        <div>
            <h1 className="ArticulateTitle">Articulate</h1>
            <h2 id="Home-RuleTitle">Rules</h2>
            <div id="Home-Description">
                Describe the generated word(s) for your teammates to guess. You
                cannot spell or rhyme the word, nor can you say the word or
                parts of the word. Each teammate will take turns being the
                describer and guesser. Each word guessed correctly moves your
                board piece by 1 position. Move your board piece to the end
                position to win. The color of the box where your board piece is
                on determines the word category.
            </div>
            <div className="Home-Squares" style={{backgroundColor: 'cyan'}}/>
            <div className="Home-ColorDescription">Object (e.g., tool box, pool
                table)
            </div>
            <div className="Home-Squares" style={{backgroundColor: '#FF7B00'}}/>
            <div className="Home-ColorDescription">Action (e.g., singing,
                driving)
            </div>
            <div className="Home-Squares" style={{backgroundColor: 'green'}}/>
            <div className="Home-ColorDescription">Nature (e.g., tulip, rose)
            </div>
            <div className="Home-Squares" style={{backgroundColor: 'blue'}}/>
            <div className="Home-ColorDescription">World (e.g., The Louvre,
                Senegal)
            </div>
            <div className="Home-Squares" style={{backgroundColor: 'yellow'}}/>
            <div className="Home-ColorDescription">Person (e.g., Peter Griffin,
                Cain)
            </div>
            <div className="Home-Squares" style={{backgroundColor: 'red'}}/>
            <div className="Home-ColorDescription">Random (e.g., chapter, wedge)
            </div>
            <div className="Home-Squares" style={{backgroundColor: 'grey'}}/>
            <div className="Home-ColorDescription">Everything (All categories)
            </div>
            <div id="Home-BtnsDiv">
                <button className="Home-Btns" onClick={handleCreateRoom}>Create
                    Room
                </button>
                <button className="Home-Btns" onClick={handleJoinRoom}>Join
                    Room
                </button>
            </div>
            <p id="Connection">Connected: {socketId ? 'YES' : 'NO'}</p>
        </div>
    );

}

export default HomePage;