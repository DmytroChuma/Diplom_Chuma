import NoRes from '../search.svg';
import Archive from '../archive.svg';
import Message from '../message.svg';
import Realtors from "../realtors.svg"
export default function NoResult(props) {
    return (
        <div className="no-result">
            <div className='no-res-text'>{props.text ? props.text : 'За вашим запитом нічого не знайдено!'}</div>
           <img className='no-res-img' src={props.archive ? Archive : props.messages ? Message : props.realtors ? Realtors : NoRes} alt="search" />
        </div>
    )
}