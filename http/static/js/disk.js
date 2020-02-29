import {DiskApi} from "./api/disk.js";
import {CheckBoxTop} from "./com/utils.js";

export class Disk {
    // {
    //   id: '#instance #disk',
    //   uuid: uuid of instance,
    //   name: name of instance,
    // }
    constructor(props) {
        this.id = props.id;
        this.name = props.name;
        this.instance = props.uuid;

        this.checkbox = new Checkbox(props);
        this.disks = this.checkbox.disks;

        // register button's click.
        $(`${this.id} #remove`).on("click", this, function (e) {
            new DiskApi({
                instance: e.data.instance,
                uuids: e.data.disks.store,
                name: e.data.name}).delete();
        });
    }

    create(data) {
        new DiskApi({instance: this.instance, name: this.name}).create(data);
    }

    edit(data) {
        new DiskApi({instance: this.instance, name: this.name}).edit(data);
    }
}


export class Checkbox {
    // {
    //   id: '#instane #disk'
    // }
    constructor(props) {
        this.id = props.id;
        this.disks = {store: [], id: this.id};

        let record = this.disks;
        let change = this.change;

        new CheckBoxTop({
            one: `${this.id} #on-one`,
            all: `${this.id} #on-all`,
            change: function (e) {
                change(record, e);
            },
        });

        // disabled firstly.
        change(record, this.disks);
    }

    change(record, from) {
        record.store = from.store;

        if (from.store.length == 0) {
            $(`${record.id} #remove`).addClass('disabled');
        } else {
            $(`${record.id} #remove`).removeClass('disabled');
        }
        if (from.store.length != 1) {
            $(`${record.id} #edit`).addClass('disabled');
        } else {
            $(`${record.id} #edit`).removeClass('disabled');
        }
    }
}