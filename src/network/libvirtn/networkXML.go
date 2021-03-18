package libvirtn

import (
	"encoding/xml"
	"github.com/danieldin95/lightstar/src/libstar"
)

type NetworkXML struct {
	XMLName     xml.Name        `xml:"network" json:"-"`
	Name        string          `xml:"name" json:"name"`
	UUID        string          `xml:"uuid" json:"uuid"`
	Forward     *ForwardXML     `xml:"forward,omitempty" json:"forward"`
	IPv4        *IPv4XML        `xml:"ip,omitempty" json:"ipv4"`
	Bridge      BridgeXML       `xml:"bridge" json:"bridge"`
	VirtualPort *VirtualPortXML `xml:"virtualport" json:"virtualport"`
}

func NewNetworkXMLFromNet(net *Network) *NetworkXML {
	obj := &NetworkXML{}
	if net == nil {
		return nil
	}
	if desc, err := net.GetXMLDesc(0); err == nil {
		if err := libstar.XML.Decode(obj, desc); err != nil {
			return obj
		}
	}
	return obj
}

type ForwardXML struct {
	XMLName xml.Name `xml:"forward" json:"-"`
	Mode    string   `xml:"mode,attr" json:"mode"`
}

type IPv4XML struct {
	XMLName xml.Name `xml:"ip" json:"-"`
	Address string   `xml:"address,attr" json:"address"`
	Prefix  string   `xml:"prefix,attr" json:"prefix"`
	Netmask string   `xml:"netmask,attr" json:"netmask"`
	DHCP    *DHCPXML `xml:"dhcp,omitempty" json:"dhcp,omitempty"`
}

type BridgeXML struct {
	XMLName xml.Name `xml:"bridge" json:"-"`
	Name    string   `xml:"name,attr" json:"name"`
	Stp     string   `xml:"stp,attr,omitempty" json:"stp,omitempty"`     // on,off
	Delay   string   `xml:"delay,attr,omitempty" json:"delay,omitempty"` // 0-32
}

type DHCPXML struct {
	XMLName xml.Name       `xml:"dhcp" json:"-"`
	Range   []DHCPRangeXML `xml:"range" json:"range"`
}

type DHCPRangeXML struct {
	XMLName xml.Name `xml:"range" json:"-"`
	Start   string   `xml:"start,attr,omitempty" json:"start,omitempty"`
	End     string   `xml:"end,attr,omitempty" json:"end,omitempty"`
}

type VirtualPortXML struct {
	XMLName xml.Name `xml:"virtualport" json:"-"`
	Type    string   `xml:"type,attr,omitempty" json:"type,omitempty"` //openvswitch
}
