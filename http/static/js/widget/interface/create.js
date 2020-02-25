import {ModalFormBase} from "../form/modal.js";
import {Option} from "../option.js";


export class InterfaceCreate extends ModalFormBase {
    //
    constructor (props) {
        super(props);

        this.render();
        this.loading();
    }

    render() {
        this.view = $(this.template());
        this.view.find("select[name='slot'] option").remove();
        for (let i = 1; i < 17; i++) {
            this.view.find("select[name='slot']").append(new Option(i, i));
        }
        this.container().html(this.view);
    }

    template() {
        return `
    <div class="modal-dialog modal-dialog-centered model-md" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="">Create Interface</h5>
            </div>
            <form name="interface-new">
            <div id="" class="modal-body">
                <div class="form-group row">
                    <label for="type" class="col-sm-4 col-form-label-sm">Network type</label>
                    <div class="col-sm-6">
                        <div class="input-group">
                            <select class="select-lg" name="type">
                                <option value="bridge" selected>Linux Bridge</option>
                                <option value="openvswitch">Open vSwitch</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="model" class="col-sm-4 col-form-label-sm">Target model</label>
                    <div class="col-sm-6">
                        <div class="input-group">
                            <select class="select-lg" name="model">
                                <option value="virtio" selected>Linux Virtual IO</option>
                                <option value="rtl8139">Realtek rtl8139</option>
                                <option value="e1000">Intel e1000</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="source" class="col-sm-4 col-form-label-sm">Bridge source</label>
                    <div class="col-sm-6">
                        <div class="input-group">
                            <select class="select-lg" name="interface">
                                <option value="virbr0" selected>Virtual Bridge0</option>
                                <option value="virbr1">Virtual Bridge1</option>
                                <option value="virbr2">Virtual Bridge2</option>
                                <option value="br-br1">OpenvSwitch Bridge1</option>
                                <option value="br-br2">OpenvSwitch Bridge2</option>
                                <option value="br-mgt">OpenvSwitch Manager Bridge</option>
                            </select>  
                        </div>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="slot" class="col-sm-4 col-form-label-sm ">Slot address</label>
                    <div class="col-sm-6">
                        <div class="input-group">
                            <select class="select-lg" name="slot">
                                <option value="0" selected>0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                            </select>  
                        </div>
                    </div>              
                </div>
            </div>
            <div id="" class="modal-footer">
                <div class="mr-0" rol="group">
                    <button name="finish-btn" class="btn btn-outline-success btn-sm">Finish</button>
                    <button name="reset-btn" class="btn btn-outline-dark btn-sm" type="reset">Reset</button>
                    <button name="cancel-btn" class="btn btn-outline-dark btn-sm">Cancel</button>
                </div>
            </div>
            </form>
        </div>
    </div>`
    }
}