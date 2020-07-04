import {Widget} from "../widget.js";
import {VolumeApi} from "../../api/volume.js";
import {CheckBox} from "../checkbox/checkbox.js";
import {Location} from "../../com/location.js";
import {Utils} from "../../com/utils.js";

export default class VolumeTable extends Widget {

    constructor(props) {
        super(props);
        this.checkbox = new CheckBox(props)
        this.pool = props.pool
    }

    loading() {
        return `<tr><td colspan="5" style="text-align: center">Loading...</td></tr>`;
    }

    refresh(data, func) {
        if (typeof data == 'function') {
            func = data;
            data = {};
        }

        $(this.id).html(this.loading());
        new VolumeApi({
            pool: this.pool
        }).list(this, function (e) {
            $(e.data.id).html(e.data.render(e.resp));
            func({data, resp: e.resp});
        })

    }
    formatData(data) {
        let items = data.items
        return Object.assign({}, data, {
            items: items.map((i) => {
                return Object.assign({}, i,
                    {
                        name:  (i.type === "dir") ? '.' + Utils.basename(i.name) : Utils.basename(i.name)
                    })
            })
        })
    }

    render(data) {

        let query = Location.query();
        let prefix = window.location.pathname
        return this.compile(`
            {{each items v i}}
                <tr class="sortable">
                    <td><input id="on-one" type="checkbox" data="{{v.uuid}}"></td>
                    <td >
                        {{if v.type == "dir"}}
                        <svg class="bi bi-folder-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z"/>
                        </svg>
                        {{else if v.type == "file"}}
                        <svg class="bi bi-file-earmark" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 1h5v1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6h1v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z"/>
                            <path d="M9 4.5V1l5 5h-3.5A1.5 1.5 0 0 1 9 4.5z"/>
                        </svg>
                        {{/if}}
                    </td>
                    <td><a id="on-this" data-name="{{v.name}}" data-type="{{v.type}}" href="javascript:void(0)">{{v.name}}</a></td>
                    <td>{{if v.type == "dir"}} - {{else}} {{v.capacity | prettyByte}} {{/if}}</td>
                    <td>{{if v.type == "dir"}} - {{else}} {{v.allocation | prettyByte}} {{/if}}</td>
                </tr>
            {{/each}}
            `, this.formatData(data));
    }
}