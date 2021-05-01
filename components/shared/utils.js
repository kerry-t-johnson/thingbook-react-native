import { REACT_APP_API_URL } from '@env'
import { parse } from "fecha";

export function apiEndpoint(path, query = {}) {
    let url = new URL(decodeURIComponent(path), REACT_APP_API_URL).href;

    let sep = '?';
    for (const key in query) {
        const value = query[key];
        if (value !== null && (Array.isArray(value) === false || value.length > 0)) {
            url = `${url}${sep}${key}=${query[key]}`;
            sep = '&';
        }
    }

    return encodeURI(url);
}

export function fetchJson(callback, path, query = {}) {
    const url = apiEndpoint(path, query);

    fetch(url).then(response => response.json()).then(callback);
}


const _intl_dateformat = new Intl.DateTimeFormat('en-US');
const _intl_datetimeformat = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
});
const _intl_timeformat = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', minute: 'numeric', second: 'numeric',
});

export function formatDate(dateStringOrObject) {
    try {
        const dateObject = typeof dateStringOrObject === 'string' ? new Date(dateStringOrObject) : dateStringOrObject;

        return _intl_dateformat.format(dateObject);
    }
    catch (error) {
        console.log(error);
        return 'Unknown';
    }
}

export function formatDateTime(dateTimeStringOrObject) {
    try {
        const dateObject = (typeof dateTimeStringOrObject === 'string') ? parse(dateTimeStringOrObject, 'isoDateTime') : dateTimeStringOrObject;

        return _intl_datetimeformat.format(dateObject);
    }
    catch (error) {
        console.log(error);
        return 'Unknown';
    }
}


export function formatTime(dateTimeStringOrObject) {
    try {
        const dateObject = (typeof dateTimeStringOrObject === 'string') ? parse(dateTimeStringOrObject, 'isoDateTime') : dateTimeStringOrObject;

        return _intl_timeformat.format(dateObject);
    }
    catch (error) {
        console.log(error);
        return 'Unknown';
    }
}

