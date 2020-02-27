import {Api} from "./api.js"
import {AlertDanger, AlertSuccess} from "../com/alert.js";


export class NetworkApi extends Api {
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
            return `/api/network/${uuid}`
        }
        return 'api/network'
    }

    create(data) {
        let your = this;

        $.post(your.url(), JSON.stringify(data), function (data, status) {
            $(your.tasks).append(AlertSuccess(`create network ${data.message}`));
        }).fail(function (e) {
            $(your.tasks).append(AlertDanger((`${this.type} ${this.url}: ${e.responseText}`)));
        });
    }

    delete() {
        let your = this;

        this.uuids.forEach(function (uuid, index, err) {
            $.delete(your.url(uuid), function (data, status) {
                $(your.tasks).append(AlertSuccess(`remove network '${uuid}' ${data.message}`));
            }).fail(function (e) {
                $(your.tasks).append(AlertDanger((`${this.type} ${this.url}: ${e.responseText}`)));
            });
        });
    }
}