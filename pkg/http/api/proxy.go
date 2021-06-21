package api

import (
	"github.com/danieldin95/lightstar/pkg/compute/libvirtc"
	"github.com/danieldin95/lightstar/pkg/http/client"
	"github.com/danieldin95/lightstar/pkg/libstar"
	"github.com/danieldin95/lightstar/pkg/schema"
	"github.com/danieldin95/lightstar/pkg/service"
	"github.com/gorilla/mux"
	"net/http"
	"sort"
)

type ProxyTcp struct {
}

func (pro ProxyTcp) Router(router *mux.Router) {
	router.HandleFunc("/api/proxy/tcp", pro.Get).Methods("GET")
}

func (pro ProxyTcp) Graphics(inst *schema.Instance) []schema.Target {
	dst := make([]schema.Target, 0, 32)
	hyper, err := libvirtc.GetHyper()
	if err != nil {
		libstar.Error("ProxyTcp.Graphics %s", err)
		return dst
	}
	for _, graphic := range inst.Graphics {
		if graphic.Port == "" || graphic.Port == "-1" {
			continue
		}
		if libstar.IsDigit(graphic.Port) {
			dst = append(dst, schema.Target{
				Name:   inst.Name,
				Target: hyper.Address + ":" + graphic.Port,
			})
		}
	}
	return dst
}

func (pro ProxyTcp) GetTarget(host string, inst *schema.Instance, leases schema.DHCPLeases) []schema.Target {
	dst := make([]schema.Target, 0, 32)
	for _, inf := range inst.Interfaces {
		libstar.Debug("ProxyTcp.Get %s", inf.Address)
		if le, ok := leases[inf.Address]; ok {
			dst = append(dst, schema.Target{
				Name:   inst.Name,
				Target: le.IPAddr + ":22",
				Host:   host,
			}) // ssh
			dst = append(dst, schema.Target{
				Name:   inst.Name,
				Target: le.IPAddr + ":3389",
				Host:   host,
			}) // rdp
			break
		}
	}
	return dst
}

func (pro ProxyTcp) Local(user *schema.User) []schema.Target {
	leases := make(map[string]schema.DHCPLease, 128)
	err := DHCPLease{}.Getx(leases)
	if err != nil {
		return nil
	}
	list := schema.ListInstance{
		Items: make([]schema.Instance, 0, 32),
	}
	Instance{}.GetByUser(user, &list)
	dst := make([]schema.Target, 0, 32)
	for _, item := range list.Items {
		dst = append(dst, pro.GetTarget("", &item, leases)...)
	}
	return dst
}

func (pro ProxyTcp) Remote(user *schema.User) []schema.Target {
	dst := make([]schema.Target, 0, 32)
	insApi := Instance{}
	for zone := range service.SERVICE.Zone.List() {
		if zone == nil {
			break
		}
		if zone.Url == "" {
			continue
		}
		cl := client.Client{
			Auth: libstar.Auth{
				Type:     "basic",
				Username: zone.Username,
				Password: zone.Password,
			},
			Host: zone.Url,
		}
		leases := schema.DHCPLeases{}
		err := client.DHCPLease{Client: cl}.Get(&leases)
		if err != nil {
			libstar.Error("ProxyTcp.Remote.Lease %s", err)
			continue
		}
		var list schema.ListInstance
		err = client.Instance{Client: cl}.Get(&list)
		if err != nil {
			libstar.Error("ProxyTcp.Remote.Instance %s", err)
			continue
		}
		for _, inst := range list.Items {
			if !insApi.HasPermission(user, inst.Name) {
				continue
			}
			dst = append(dst, pro.GetTarget(zone.Name, &inst, leases)...)
		}
	}
	return dst
}

func (pro ProxyTcp) Get(w http.ResponseWriter, r *http.Request) {
	user, _ := GetUser(r)
	tgt := make([]schema.Target, 0, 32)
	tgt = append(tgt, pro.Local(&user)...)
	tgt = append(tgt, pro.Remote(&user)...)
	sort.SliceStable(tgt, func(i, j int) bool {
		return (tgt[i].Host + ":" + tgt[i].Name) < (tgt[j].Host + ":" + tgt[j].Name)
	})
	ResponseJson(w, tgt)
}
