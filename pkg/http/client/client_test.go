package client

import (
	"fmt"
	"github.com/danieldin95/lightstar/pkg/libstar"
	"github.com/danieldin95/lightstar/pkg/schema"
	"testing"
)

func TestDHCPLease_Get(t *testing.T) {
	api := DHCPLease{
		Client: Client{
			Auth: libstar.Auth{
				Type:     "basic",
				Username: "admin:123",
			},
			Host: "https://localhost:10080",
		},
	}
	les := schema.DHCPLeases{}
	fmt.Println(api.Get(&les), les)
	les = schema.DHCPLeases{}
	api.Client.Auth.Username = "123"
	fmt.Println(api.Get(&les), les)
}

func TestProxyTcp_Get(t *testing.T) {
	api := ProxyTcp{
		Client: Client{
			Auth: libstar.Auth{
				Type:     "basic",
				Username: "admin:123",
			},
			Host: "https://localhost:10080",
		},
	}
	var ps []schema.Target
	fmt.Println(api.Get(&ps), ps)
}

func TestInstance_Get(t *testing.T) {
	api := Instance{
		Client: Client{
			Auth: libstar.Auth{
				Type:     "basic",
				Username: "admin:123",
			},
			Host: "https://localhost:10080",
		},
	}
	var data schema.ListInstance
	fmt.Println(api.Get(&data), data)
}
