//
export class FormModal {
    // {
    //   id: '#disk'
    // }
    constructor(props) {
        this.props = props;
        this.id = props.id;
        this.forms = `${this.id} form`;

        this.events = {
            submit: {
                func: function (e) {
                },
                data: undefined,
            }
        };
    }

    template() {
        return (`<not-implement/>`);
    }

    render() {
        this.view = $(this.template());
        this.container().html(this.view);
    }

    fetch() {
        console.log('not-implement')
    }

    submit() {
        if (this.events.submit.func) {
            this.events.submit.func({
                data: this.events.submit.data,
                form: $(this.forms).serializeArray(),
            });
        }
    }

    container() {
        return $(this.id);
    }

    onsubmit(data, func) {
        if (typeof data == "function") {
            this.events.submit.data = {};
            this.events.submit.func = data;
        } else {
            this.events.submit.data = data;
            this.events.submit.func = func;
        }
    }

    loading() {
        this.container().find('[name=finish-btn]').on('click', this, function(e) {
            e.data.submit();
            e.data.container().modal("hide");
        });
        this.container().find('[name=cancel-btn]').on('click', this, function(e) {
            e.data.container().modal("hide");
        });
        $(this.forms).each(function (i, e) {
            $(e).on('submit', function (e) {
                return false;
            });
        });
    }

    compile(tmpl, data) {
        return template.compile(tmpl)(data);
    }
}
