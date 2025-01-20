export default function Artisticon({className}: {className: string}) {
    return (
        <svg id="artist_icon" data-name="artist_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.9 20"
            stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} height="1em" width="1em"
        >
            <path d="M15,15H7a4,4,0,0,0-4,4v2" transform="translate(-2 -2)"/>
            <circle cx="9" cy="5" r="4"/>
            <path d="M20.9,18.8V9.26" transform="translate(-2 -2)"/>
            <circle cx="16.7" cy="16.8" r="2.2"/>
        </svg>
    );
}