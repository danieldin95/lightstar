package storage

import (
	"github.com/danieldin95/lightstar/src/libstar"
	"github.com/danieldin95/lightstar/src/schema"
	"github.com/danieldin95/lightstar/src/storage/libvirts"
)

func NewDataStore(pol libvirts.Pool) schema.DataStore {
	obj := schema.DataStore{}
	xml, _ := pol.GetXMLDesc(0)
	xmlObj := &libvirts.PoolXML{}
	_ = libstar.XML.Decode(xmlObj, xml)

	obj.Id = xmlObj.Name
	obj.Name = xmlObj.Name
	obj.UUID = xmlObj.UUID
	if len(obj.Name) == 2 && libstar.IsDigit(obj.Name) {
		obj.Name = "datastore@" + obj.Name
	}
	obj.Type = xmlObj.Type
	switch obj.Type {
	case "netfs":
		if xmlObj.Source.Format.Type == "nfs" {
			obj.Source = "nfs://" + xmlObj.Source.Host.Name + xmlObj.Source.Dir.Path
		}
		if xmlObj.Source.Format.Type == "auto" {
			obj.Source = "auto://" + xmlObj.Source.Host.Name + xmlObj.Source.Dir.Path
		}
	case "dir":
		obj.Source = obj.Type + "://" + xmlObj.Target.Path
	default:
		obj.Source = obj.Type + "://" + obj.Name
	}
	if info, err := pol.GetInfo(); err == nil {
		obj.State = libvirts.PoolState2Str(info.State)
		obj.Capacity = info.Capacity
		obj.Available = info.Available
		obj.Allocation = info.Allocation
	}
	return obj
}
