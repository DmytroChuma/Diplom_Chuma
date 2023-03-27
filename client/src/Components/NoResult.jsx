import NoRes from '../search.svg';
import Archive from '../archive.svg';
export default function NoResult(props) {
    return (
        <div className="no-result">
            <div className='no-res-text'>{props.text ? props.text : 'За вашим запитом нічого не знайдено!'}</div>
           <img className='no-res-img' src={props.archive ? Archive : NoRes} alt="search" />
        </div>
    )
}