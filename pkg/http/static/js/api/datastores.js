import {Api} from "./api.js"


export class DataStoreApi extends Api {
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
            return super.url(`/datastore/${uuid}`);
        }
        return super.url('/datastore');
    }
    create(data) {
        if (data.format === 'nfs') {
            data.nfs = { host: data.host, path: data.path, format: 'nfs' };
        }
        super.create(data)
    }
}
