import momentTimeZone from "moment-timezone";
import cityTimeZone from "city-timezones";
import _ from "lodash";

/**
 * Mixin for conversion time to time zone by state
 */
export default {
    name: 'TimeZoneConverter',
    data() {
        return {
            dateTimeFormat: 'DD-MM-YYYY HH:mm'
        }
    },
    props: {
        data: {
            default: () => {
                return {}
            }
        }
    },
    methods: {
        /**
         * Return Time Zone by state name
         * @param state
         * @return {string}
         */
        getUtcTimeZoneByState(state) {
            let tm = cityTimeZone.findFromCityStateProvince(state),
                result = '';
            if (!_.isEmpty(tm)) {
                result = tm[0].timezone;
            }
            return result;
        },
        /**
         * Return UTC time zone offset by state
         * @param state
         * @param timeZone
         * @return {number}
         */
        getUtcTimeZoneOffsetByState(state = '', timeZone = '') {
            let tm = (!timeZone)?this.getUtcTimeZoneByState(state):timeZone,
                timeZoneOffset = 0;
            if (!_.isEmpty(tm)) {
                timeZoneOffset = this.getUtcTimeZoneOffset(tm);
            }
            return timeZoneOffset;
        },
        /**
         * Return UTC offset by time zone
         * @param timezone
         * @return {number}
         */
        getUtcTimeZoneOffset(timezone = '') {
            let tz = momentTimeZone().tz(timezone);
            return tz.utcOffset();
        },
        /**
         * Return converted time string with format (this.format)
         * @param time must include Time Zone if empty then convert current time
         * @param state
         * @return {string}
         */
        getTimeByState(time = '', state = '') {
            let newTime = (!_.isEmpty(time)) ? momentTimeZone(time) : momentTimeZone();
            try {
                if (!_.isEmpty(state)) {
                    let tm = this.getUtcTimeZoneByState(state);
                    if(tm){
                        let timeZoneOffset = this.getUtcTimeZoneOffsetByState(state, tm),
                            newTimeOffset = newTime.utcOffset();
                        newTime.add(timeZoneOffset - newTimeOffset, 'minutes');
                    }
                }
            } catch (e) {
                console.log('TimeZoneConverter Error', e);
            }
            return newTime.format(this.dateTimeFormat);
        }
    }
}
