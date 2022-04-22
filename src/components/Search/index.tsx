import { useEffect, useState, ChangeEvent } from "react";
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import { dataAccessToken } from '../../Data/Action.js';
import Track from "../Track";
import Login from "../Login";
import Recent from "../RecentSearch";
import Play from '../Playlist/play';
import { getUserProfile } from '../../Data/Profile.js';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Image from "../UI/Image";
import axios from "axios";

type Searches = {
    tokencode: string
};
  
type Props = {
    search: Searches;
    users: User;
};

type User = {
    id: string;
};

type itemKey = {
    uri: string;
    url: string;
    album: {
        name: string;
        images: { url: string }[]
    },
    name: string,
    artists: { name: string }[],
    images: string; 
}

type itemKeyRecent = {
    id: string;
    img: string;
    title: string;
    artist: string;
}


/* eslint-disable @typescript-eslint/no-unused-vars */
const Search = ({search, users}:Props)=> {
    const token = useSelector((state: RootStateOrAny) => state.dataAccessToken.value);
    const [login, setLogin] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [tracks, setTracks] = useState([]);
    const [recent, setRecent] = useState([]);
    const [selectedlist, setSelectedList] = useState([]);
    const [user, setUser] = useState({});
    const [userId, setUserId] = useState({});
    const dispatch = useDispatch();
    /* eslint-enable @typescript-eslint/no-unused-vars */

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
    }

    const handleSubmit = async () => {
        try {
            const response = await axios.get("https://api.spotify.com/v1/search", {
                params: {
                    type: 'track',
                    q: keyword,
                    limit: 6
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }

            })
            setRecent(tracks);
            setTracks(response.data.tracks.items);
        }
        catch (e) {
            alert(`Kamu belum login ${e}`)
            console.error(e)
        }

    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    useEffect(() => {
        const accessTokenParams = token;

        if (accessTokenParams !== null) {
            dispatch(dataAccessToken(accessTokenParams));
    
            const setUserProfile = async () => {
            try {
                const response = await getUserProfile(accessTokenParams);
    
                setUser(response);
                setUserId(response.id);
                setLogin(true);
            } catch (e) {
                //console.log('error');
            }
            }
        setUserProfile();
        }
    }, []);

    return (
        <div className="search-content">
       
        <Login />
            {(login) ? (
                <>
                <Play
                    accessToken={token}
                    userId={userId}
                    uriTracks={selectedlist}
                />
                    <div className="search-form">
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            size="small"
                            onChange={handleInput}
                            onKeyPress={handleKeyPress}
                            sx={{
                                'input': {
                                    color: 'white',
                                    ariaLabel:'search-form'
                                },
                                '&::placeholder': {
                                    color: 'blue',
                                },
                                '& label.Mui-focused': {
                                    color: 'green',
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottomColor: 'green',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                    borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                    borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                    borderColor: 'white',
                                    },
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{
                                fontWeight: 'bold',
                                marginLeft: '10px',
                                backgroundColor: "#14f732",
                                height: '40px',
                                '&:hover': {
                                backgroundColor: '#85e408',
}
                            }}
                        >
                            Cari
                        </Button>
                    </div>
                    <h1>Hasil pencarian : {keyword}</h1>
                    <div className="Album-container">
                        <div className="Songs-container">
                            {
                                tracks.map((item: itemKey) => (
                                    <Track
                                        key={item.uri}
                                        albumName={item.album.name}
                                        songName={item.name}
                                        uri={item.uri}
                                        url={item.album.images[0].url}
                                        artistName={item.artists[0].name}
                                        setSelectedList={setSelectedList}
                                        selectedlist={selectedlist}
                                    />
                                ))
                            }
                        </div>
                    </div>
                    <div className="Recent-search">
                        <br></br>
                        <h1>Riwayat Pencarian Sebelumnya</h1>
                        <div className="Album-container-recent">
                            {recent.map((item: itemKeyRecent) => (
                                <Recent
                                    key={item.id}
                                    recentsearch={item}
                                />
                                )
                            )
                            }
                        </div>
                        <br></br>
                    </div>
                </>
            )
                :
            <h2>Status: belum login</h2>
            }
        </div>
    )
}

export default Search;