import {Widget} from "../widget.js";
import {GraphicsApi} from "../../api/graphics.js";


export class GraphicsTable extends Widget {
    // {
    //   id: '#xx',
    //   inst: 'uuid',
    // }
    constructor(props) {
        super(props);
        this.inst = props.inst;
    }

    loading() {
        return `<tr><td colspan="5" class="text-center">Loading...</td></tr>`;
    }

    refresh(data, func) {
        if (typeof data == 'function') {
            func = data;
            data = {};
        }
        $(this.id).html(this.loading());
        new GraphicsApi({
            tasks: this.tasks,
            inst: this.inst,
        }).list(this,function (e) {
            $(e.data.id).html(e.data.render(e.resp));
            func({data, resp: e.resp});
        });
    }

    render(data) {
        return this.compile(`
        {{if (items.length === 0)}}
            <tr>
                <td colspan="5" class="text-center">{{'no data to display' | i}}</td>
            </tr>
        {{/if}}
        {{each items v i}}
            <tr>
                <td><input id="on-one" type="checkbox" data="{{v.type}}"></td>
                <td>{{i+1}}</td>
                <td>{{v.type}}</td>
                <td>{{v.password}}</td>
                <td>{{v.listen}}:{{v.port != '' ? v.port : -1}}</td>
            </tr>
        {{/each}}
        `, data);
    }
}
