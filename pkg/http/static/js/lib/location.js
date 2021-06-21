
export class Location {
    // {
    //   data: '',
    //   func: function (e) {}
    // }
    static listen(on) {
        if (!this.on) {
            this.on = [];
        }
        this.on.push(on);
    }

    static href(value) {
        if (value) {
            window.location.href = value;
        }
        return window.location.href;
    }

    // set page name after # and not change query.
    static set(name) {
        name = name || "";
        let path = this.href();
        let uri = path.split('#', 2)[0];
        let query = this.query();

        this.href(uri + '#' + name + "?" + query);
        if (!this.on) {
            this.on = [];
        }
        for (let on of this.on) {
            if (on && on.func) {
                on.func({data: on.data, name});
            }
        }
    }

    static get (name) {
        name = name || "";
        let path = this.href();
        let rawPage = '';
        if (path.indexOf('#') >= 0) {
            rawPage = path.split('#', 2)[1];
        }
        let cur = rawPage.split('?')[0];
        return cur ? cur : name;
    }

    static url() {
        let path = this.href();
        return path.split('#')[0];
    }

    // get query by name if value is undefined.
    // set query by name if value is defined and string.
    static query(name, value) {
        let url = this.url();
        let page = this.get();

        if (name && value !== undefined) {
            this.href(url + "#" + page + "?" + name + "=" + value);
        }
        let path = this.href();
        page = "";
        if (path.indexOf('#') >= 0) {
            page = path.split('#', 2)[1];
        }
        let query = "";
        if (page.indexOf('?') >= 0) {
            query = page.split("?", 2)[1];
        }
        if (name && value === undefined) {
            let values = query.split('&');
            for (let ele of values) {
                if (ele.indexOf('=') < 0) {
                    continue
                }
                let [k, v] = ele.split('=', 2);
                if (k === name) {
                    return v;
                }
            }
            return undefined
        }
        return query;
    }
}
