type RecentSearch = {
    img: string;
    title: string;
    artist: string;
};
  
type Props = {
    recentsearch: RecentSearch;
};

const Recent = ({recentsearch}:Props)=>{

    return(
        <div className="Recent-container">
            <div className="thumbnail-wrapper">
                <img src={recentsearch.img} alt="" className="thumbnail" />
            </div>
            <div className="Content-recent-wrapper">
                <p className="track-title">{recentsearch.title}</p>
                <p className="artist-name">{recentsearch.artist}</p>
            </div>
        </div>
    )
}

export default Recent; 