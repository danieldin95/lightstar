import {Api} from "./api.js"


export class ZoneApi extends Api {
    // {
    //   uuids: [],
    //   tasks: 'tasks',
    //   name: ''
    // }
    constructor(props) {
        super(props);
    }

    url(uuid) {
        if (uuid) {
            return `/api/zone/${uuid}`;
        }
        return '/api/zone';
    }
}
