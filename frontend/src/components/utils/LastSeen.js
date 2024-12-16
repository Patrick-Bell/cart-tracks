import ReactTimeAgo from 'react-time-ago';
import moment from 'moment-timezone';
import en from 'javascript-time-ago/locale/en'
import TimeAgo from 'javascript-time-ago'

TimeAgo.addDefaultLocale(en)



export default function LastSeen({ date }) {
  if (date) {
    
    return (
        <span>About <ReactTimeAgo date={date} timeStyle="round" /></span>
    );
  } 
}
